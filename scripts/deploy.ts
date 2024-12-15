import hardhat, { ethers, network } from "hardhat";
import { JsonRpcProvider } from "@ethersproject/providers"; 

const infuraUrl = process.env.BCS_API_URL;
const provider = new JsonRpcProvider(infuraUrl);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const LOL = await ethers.getContractFactory("LOL");

  // Разворачиваем контракт и передаем deployer.address как initialOwner
  const lol = await LOL.deploy(deployer.address);

  const deploymentTx = lol.deploymentTransaction();
  if (deploymentTx === null) {
    throw new Error("Smth went wrong with deploy.");
  }

  console.log("Транзакция развертывания контракта отправлена:", deploymentTx.hash);

  // Ожидаем 5 подтверждений
  const receipt = await deploymentTx.wait(5);
  console.log(`Контракт lol развернут по адресу: ${lol.target} после 5 подтверждений`);


  console.log("Верификация контракта...");
  await hardhat.run("verify:verify", {
    address: lol.target,
    constructorArguments: [deployer.address], 
  });

  const addresses = { lol: lol.target };
  saveAddresses(addresses, network.name);

  console.log(`Развертывание и верификация прошли успешно`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Развертывание не удалось:", error);
    process.exit(1);
  });

function saveAddresses(addresses: any, networkName: string) {
  const fs = require('fs');
  const filePath = `./addresses/${networkName}.json`;

  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
  console.log(`Адреса сохранены в ${filePath}`);
}
