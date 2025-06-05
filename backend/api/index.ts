import { getRecord } from './records';
import { getFamilyTree } from './tree';

const record = await getRecord(1);

const tree = await getFamilyTree(1)

// console.log(record);
console.log(tree);