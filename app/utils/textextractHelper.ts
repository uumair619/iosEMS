var _ = require('lodash');


const getKeyValueMap = (blocks: any) => {
    const keyMap = {};
    const valueMap = {};
    const blockMap = {};


    let blockId;
    blocks.forEach(block => {
        blockId = block?.Id;
        blockMap[blockId] = block;


        if (block.BlockType === "KEY_VALUE_SET") {
            if (_.includes(block.EntityTypes, "KEY")) {
                keyMap[blockId] = block;
            } else {
                valueMap[blockId] = block;
            }
        }
    });
    return { keyMap, valueMap, blockMap };
};
const getKeyValueRelationship = (keyMap, valueMap, blockMap) => {
    const keyValues = {};

    const keyMapValues = _.values(keyMap);
    keyMapValues.forEach(keyMapValue => {
        const valueBlock = findValueBlock(keyMapValue, valueMap);
        const key = getText(keyMapValue, blockMap);
        const value = getText(valueBlock, blockMap);
        keyValues[key] = value;
    });
    return keyValues;
};

const findValueBlock = (keyBlock, valueMap) => {
    let valueBlock;

    if (keyBlock?.Relationships) {
        keyBlock?.Relationships.forEach(relationship => {
            if (relationship.Type === "VALUE") {
                // eslint-disable-next-line array-callback-return
                relationship.Ids.every(valueId => {

                    if (_.has(valueMap, valueId)) {
                        valueBlock = valueMap[valueId];
                        return false;
                    }
                });
            }
        });
    }
    return valueBlock;
};
const getTableData = (blocks, blockMap) => {
    const tables = [];

    blocks.forEach((block) => {
        if (block.BlockType === "TABLE") {
            const table = {
                rows: [],
            };

            block.Relationships.forEach((relationship) => {
                if (relationship.Type === "CHILD") {
                    relationship.Ids.forEach((cellId) => {
                        const cell = blockMap[cellId]; // Use blockMap to get the cell
                        const text = getText(cell, blockMap); // Pass blockMap to getText
                        table.rows.push(text);
                    });
                }
            });

            tables.push(table);
        }
    });

    return tables;
};
const getText = (result, blocksMap, isTable = false) => {

    let text = "";

    if (_.has(result, "Relationships")) {

        result.Relationships.forEach(relationship => {

            if (relationship.Type === "CHILD") {

                relationship.Ids.forEach(childId => {
                    const word = blocksMap[childId];
                    if (isTable) {
                        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                        console.log("🚀 ~ file: App.tsx:180 ~ getText ~ word:", word)
                        console.log("🚀 ~ file: App.tsx:179 ~ getText ~ childId:", childId)
                        console.log("🚀 ~ sdafdsfadsffsssssssssssssssssssss", blocksMap)
                    }
                    if (word.BlockType === "WORD" || word.BlockType === "CELL") {
                        text += `${word.Text} `;
                    }
                    if (word.BlockType === "SELECTION_ELEMENT") {
                        if (word.SelectionStatus === "SELECTED") {
                            text += `X `;
                        }
                    }
                });
            }
        });
    }

    return text.trim();
};

function capitalize(s:string)
{
    return (s[0].toLowerCase()).toUpperCase() + s.slice(1);
}

export {getKeyValueMap, getKeyValueRelationship, getTableData,capitalize}