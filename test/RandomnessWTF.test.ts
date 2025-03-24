import { expect } from "chai";
import { ethers } from "hardhat";
import { RandomnessWTF } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("RandomnessWTF", function () {
  // The address of the Cadence Architecture precompile
  const CADENCE_ARCH = "0x0000000000000000000000010000000000000001";

  async function deployRandomnessWTFFixture() {
    const [owner] = await ethers.getSigners();

    const RandomnessWTF = await ethers.getContractFactory("RandomnessWTF");
    const randomnessWTF = await RandomnessWTF.deploy();

    return { randomnessWTF, owner };
  }

  describe("getRandomNumber", function () {
    it("should return a number within the specified range", async function () {
      const { randomnessWTF } = await loadFixture(deployRandomnessWTFFixture);

      // For testing purposes, we need to override the precompile call
      // We'll use hardhat_setCode to replace the precompile with our mock
      const MockPrecompile = await ethers.getContractFactory("MockCadencePrecompile");
      const mockPrecompile = await MockPrecompile.deploy(42); // Fixed random value

      // Replace the precompile with our mock
      await ethers.provider.send("hardhat_setCode", [
        CADENCE_ARCH,
        await ethers.provider.getCode(await mockPrecompile.getAddress())
      ]);

      const min = 1n;
      const max = 100n;

      const randomNumber = await randomnessWTF.getRandomNumber(min, max);

      // Check that the number is within range
      expect(randomNumber).to.be.gte(min);
      expect(randomNumber).to.be.lte(max);
    });

    it("should revert when min is greater than max", async function () {
      const { randomnessWTF } = await loadFixture(deployRandomnessWTFFixture);

      const min = 100n;
      const max = 1n;

      await expect(randomnessWTF.getRandomNumber(min, max)).to.be.reverted;
    });
  });

  describe("selectRandomItem", function () {
    it("should select one of the provided items", async function () {
      const { randomnessWTF } = await loadFixture(deployRandomnessWTFFixture);

      // Create a mock precompile that returns a fixed value
      const MockPrecompile = await ethers.getContractFactory("MockCadencePrecompile");
      const mockPrecompile = await MockPrecompile.deploy(1); // Fixed random value

      // Replace the precompile with our mock
      await ethers.provider.send("hardhat_setCode", [
        CADENCE_ARCH,
        await ethers.provider.getCode(await mockPrecompile.getAddress())
      ]);

      const items = ["Apple", "Banana", "Orange"];

      const selectedItem = await randomnessWTF.selectRandomItem(items);

      // Check that the selected item is one of our items
      expect(items).to.include(selectedItem);
    });

    it("should revert when the items array is empty", async function () {
      const { randomnessWTF } = await loadFixture(deployRandomnessWTFFixture);

      const emptyItems: string[] = [];
      await expect(randomnessWTF.selectRandomItem(emptyItems))
        .to.be.revertedWithCustomError(randomnessWTF, "EmptyItemArray");
    });

    it("should select an item from a larger array", async function () {
      const { randomnessWTF } = await loadFixture(deployRandomnessWTFFixture);

      const MockPrecompile = await ethers.getContractFactory("MockCadencePrecompile");
      const mockPrecompile = await MockPrecompile.deploy(3);

      await ethers.provider.send("hardhat_setCode", [
        CADENCE_ARCH,
        await ethers.provider.getCode(await mockPrecompile.getAddress())
      ]);

      const items = ["Apple", "Banana", "Orange", "Grape", "Mango"];
      const selectedItem = await randomnessWTF.selectRandomItem(items);
      expect(items).to.include(selectedItem);
    });
  });
});