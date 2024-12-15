import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("RoyalFools", function () {
  let royalFools: any;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const initialURI = "ipfs://some_uri/";
  const initialMaxSupply = 8000;
  const initialInPrison = 100;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0]!;
    addr1 = signers[1]!;
    addr2 = signers[2]!;

    const factory = await ethers.getContractFactory("RoyalFools");
    royalFools = await factory.deploy(initialURI, initialMaxSupply, initialInPrison);
    await royalFools.waitForDeployment();
  });

  it("Should have correct initial state", async function () {
    expect(await royalFools.originFoolsURI()).to.equal(initialURI);
    expect(await royalFools.royalCourt()).to.equal(initialMaxSupply);
  });

  it("Only owner can toggle sales", async function () {
    // Теперь проверяем custom error для Ownable
    await expect(royalFools.connect(addr1).saleOn())
      .to.be.revertedWithCustomError(royalFools, "OwnableCallerNotOwner");
    
    await royalFools.connect(owner).saleOn();
    expect(await royalFools.paused()).to.equal(false);

    await royalFools.connect(owner).saleOff();
    expect(await royalFools.paused()).to.equal(true);
  });

  it("Only owner can change URI", async function () {
    // Проверка revert для Ownable
    await expect(royalFools.connect(addr1).theDungeonMaster("new_uri"))
      .to.be.revertedWithCustomError(royalFools, "OwnableCallerNotOwner");
    
    await royalFools.theDungeonMaster("new_uri");
    expect(await royalFools.originFoolsURI()).to.equal("new_uri");
  });

  it("Only owner can setInPrison", async function () {
    await expect(royalFools.connect(addr1).setInPrison(200))
      .to.be.revertedWithCustomError(royalFools, "OwnableCallerNotOwner");
    
    await royalFools.setInPrison(200);
    await royalFools.connect(owner).homeBoy(); 
    expect(await royalFools.totalSupply()).to.equal(200);
  });

  it("Only owner can setMaxMintSupply", async function () {
    await expect(royalFools.connect(addr1).setMaxMintSupply(9000))
      .to.be.revertedWithCustomError(royalFools, "OwnableCallerNotOwner");
    
    await royalFools.setMaxMintSupply(9000);
    expect(await royalFools.royalCourt()).to.equal(9000);
  });

  it("mintFool should revert if sale is paused", async function () {
    // При паузе используем custom error Pausable
    await expect(royalFools.connect(addr1).mintFool())
      .to.be.revertedWithCustomError(royalFools, "Paused");
    
    await royalFools.saleOn();
    await royalFools.connect(addr1).mintFool();  
    expect(await royalFools.totalSupply()).to.equal(1);  
    expect(await royalFools.balanceOf(await addr1.getAddress())).to.equal(1);
  });

  it("mintFool should revert if already minted", async function () {
    await royalFools.saleOn();
    await royalFools.connect(addr1).mintFool();
    // Предполагается, что в контракте есть error AlreadyMinted();
    await expect(royalFools.connect(addr1).mintFool())
      .to.be.revertedWithCustomError(royalFools, "AlreadyMinted");
  });

  it("godsMessage should allow owner to airdrop tokens", async function () {
    await royalFools.saleOn();
    await royalFools.godsMessage(2, [await addr1.getAddress(), await addr2.getAddress()]);
    expect(await royalFools.totalSupply()).to.equal(4);
    expect(await royalFools.balanceOf(await addr1.getAddress())).to.equal(2);
    expect(await royalFools.balanceOf(await addr2.getAddress())).to.equal(2);
  });

  it("godsMessage should revert for null address", async function () {
    await royalFools.saleOn();
    // Предполагается, что в контракте есть error NullAddress();
    await expect(royalFools.godsMessage(1, [ethers.ZeroAddress]))
      .to.be.revertedWithCustomError(royalFools, "NullAddress");
  });

  it("Should revert if exceed max supply", async function () {
    await royalFools.setMaxMintSupply(2); 
    await royalFools.saleOn();
    await royalFools.connect(addr1).mintFool(); 
    // Предполагается, что есть error ExceedSupply();
    await expect(royalFools.godsMessage(2, [await addr2.getAddress()]))
      .to.be.revertedWithCustomError(royalFools, "ExceedSupply");
  });

  it("Should return correct SECRETPHRASE", async function () {
    expect(await royalFools.LhlTaKool()).to.equal("13477431");
  });
});
