#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const path = require('node:path');
const fs = require('fs');

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .option('-f, --format <type>', 'output format')
  .version('0.0.1')
  .action((file1Path, file2Path) => {
	const normalPathFile1 = path.resolve('./', file1Path);
	const normalPathFile2 = path.resolve('./', file2Path);
	
	const file1 = JSON.parse(fs.readFileSync(normalPathFile1));
  	const file2 = JSON.parse(fs.readFileSync(normalPathFile2));
	const allKeys = new Set([...Object.keys(file1), ...Object.keys(file2)]);

	let result = '';

	for (const key of allKeys) {
		if (!file1.hasOwnProperty(key)) {
		  result += `+ ${key}: ${JSON.stringify(file2[key])}\n`;
		} else if (!file2.hasOwnProperty(key)) {
		  result += `- ${key}: ${JSON.stringify(file1[key])}\n`;
		} else if (JSON.stringify(file1[key]) !== JSON.stringify(file2[key])) {
		  result += `- ${key}: ${JSON.stringify(file1[key])}\n`;
		  result += `+ ${key}: ${JSON.stringify(file2[key])}\n`;
		} else {
		  result += `  ${key}: ${JSON.stringify(file1[key])}\n`;
		}
	  }
	  console.log(`{\n${result}}`)
  });
program.parse();