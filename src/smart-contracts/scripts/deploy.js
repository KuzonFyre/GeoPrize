async function main() {
    // const HelloWorld = await ethers.getContractFactory("HelloWorld");
    // const hello_world = await HelloWorld.deploy("Hello World!");
    // console.log("Contract Deployed to Address:", hello_world.address);
    const GeoPrize = await ethers.getContractFactory("GeoPrize");
    const geo_prize = await GeoPrize.deploy();
    console.log("Contract Deployed to Address:", geo_prize.address);
  }
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });