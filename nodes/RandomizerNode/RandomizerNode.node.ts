import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeParameterValue,
} from 'n8n-workflow';

export class RandomizerNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Randomizer',
		name: 'randomizerNode',
		icon: 'file:randomizerNode.svg',
		group: ['transform'],
		version: 1,
		description: 'Randomly directs input to multiple outputs based on given percentage or randomly',
		defaults: {
			name: 'Randomizer',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: ['main', 'main'],
		inputNames: ['A', 'B'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Selection Method',
				name: 'selectionMethod',
				type: 'options',
				options: [
					{
						name: 'Random',
						value: 'random',
					},
					{
						name: 'Percentage',
						value: 'percentage',
					},
				],
				default: 'random',
				description: 'Choose whether to randomly select input or use a percentage value',
			},
			{
				displayName: 'Input Percentage for Input A (Only Numbers)',
				name: 'inputPercentage',
				type: 'number',
				displayOptions: {
					show: {
						selectionMethod: [
							'percentage',
						],
					},
				},
				default: 60,
				description: 'If you set the percentage to 60, then the node will select the A input 60% of the time and the B input 40% of the time',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | null> {
		const option = this.getNodeParameter('selectionMethod', 0) as NodeParameterValue;

		if (option === 'random') {
			const inputDataA = this.getInputData(0);
			const inputDataB = this.getInputData(1);

			if (!inputDataA || !inputDataB) {
				// eslint-disable-next-line n8n-nodes-base/node-execute-block-wrong-error-thrown
				throw new Error('No input data found. Make sure to connect two inputs and that they contain data.');
			}

			const outputData: INodeExecutionData[] = [];

			if (Math.random() >= 0.5) {
				outputData.push(...inputDataA);
			} else {
				outputData.push(...inputDataB);
			}

			return outputData.length > 0 ? [outputData] : null;
		} else if (option === 'percentage') {
			const inputAWeightage = parseFloat(this.getNodeParameter('inputPercentage', 0) as string);
			const inputBWeightage = 100 - inputAWeightage;

			if (inputAWeightage >= 49 && inputAWeightage <= 59) {
				// eslint-disable-next-line n8n-nodes-base/node-execute-block-wrong-error-thrown
				throw new Error('Use Random option instead of Percentage with 49-59%');
			}

			const inputDataA = this.getInputData(0);
			const inputDataB = this.getInputData(1);

			const outputData: INodeExecutionData[] = [];

			if (inputDataA && inputDataA.length > 0 && Math.random() * 100 < inputAWeightage) {
				outputData.push(...inputDataA);
			}

			if (inputDataB && inputDataB.length > 0 && Math.random() * 100 < inputBWeightage) {
				outputData.push(...inputDataB);
			}

			return outputData.length > 0 ? [outputData] : null;
		} else {
			// eslint-disable-next-line n8n-nodes-base/node-execute-block-wrong-error-thrown
			throw new Error(`Invalid selectionMethod parameter value "${option}"`);
		}
	}

}
