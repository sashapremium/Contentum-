export const exampleForm = {
  step: 0,
  type: 'form' as const,
  title: 'Example Test Form',
  description:
    'This form includes every field type to test the UI + validation logic.',
  disabled: true,
  modes: [
    {
      name: 'basic',
      label: 'Basic Info',
      fieldsGroups: [
        {
          groupName: 'textGroup',
          groupLabel: 'Text & Search Fields',
          groupFields: [
            {
              name: 'shortText',
              type: 'text' as const,
              label: 'Short Text (minLength 3)',
              required: true,
              value: null,
              validation: { minLength: 3, maxLength: 20 },
            },
            {
              name: 'longText',
              type: 'text' as const,
              label: 'Long Text (maxLength 300)',
              required: false,
              value: null,
              validation: { maxLength: 300 },
            },
            {
              name: 'searchItem',
              type: 'search' as const,
              label: 'Searchable Option',
              required: false,
              value: null,
              options: [
                { value: 'optA', label: 'Option A' },
                { value: 'optB', label: 'Option B' },
              ],
              validation: { minLength: 2 },
            },
            {
              name: 'searchReq',
              type: 'search' as const,
              label: 'Required Search',
              required: true,
              value: null,
              options: [
                { value: 'opt1', label: 'Option 1' },
                { value: 'opt2', label: 'Option 2' },
              ],
              validation: { minLength: 1 },
            },
          ],
        },
        {
          groupName: 'selectGroup',
          groupLabel: 'Select & Multiple',
          groupFields: [
            {
              name: 'simpleSelect',
              type: 'select' as const,
              label: 'Simple Select',
              required: true,
              value: null,
              options: [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B' },
                { value: 'c', label: 'C' },
              ],
            },
            {
              name: 'optionalSelect',
              type: 'select' as const,
              label: 'Optional Select',
              required: false,
              value: null,
              options: [
                { value: 'x', label: 'X' },
                { value: 'y', label: 'Y' },
              ],
            },
            {
              name: 'multiSelect',
              type: 'multiple' as const,
              label: 'Multiple Select (maxItems 3)',
              required: true,
              value: null,
              options: [
                { value: 'm1', label: 'M1' },
                { value: 'm2', label: 'M2' },
                { value: 'm3', label: 'M3' },
                { value: 'm4', label: 'M4' },
              ],
              validation: { maxItems: 3 },
            },
            {
              name: 'multiOpt',
              type: 'multiple' as const,
              label: 'Optional Multiple',
              required: false,
              value: null,
              options: [
                { value: 'o1', label: 'O1' },
                { value: 'o2', label: 'O2' },
              ],
            },
          ],
        },
        {
          groupName: 'boolGroup',
          groupLabel: 'Checkbox Fields',
          groupFields: [
            {
              name: 'acceptTerms',
              type: 'checkbox' as const,
              label: 'Accept Terms (required)',
              required: true,
              value: null,
            },
            {
              name: 'subscribe',
              type: 'checkbox' as const,
              label: 'Subscribe (optional)',
              required: false,
              value: null,
            },
          ],
        },
        {
          groupName: 'dateGroup',
          groupLabel: 'Datetime Fields',
          groupFields: [
            {
              name: 'appointment',
              type: 'datetime' as const,
              label: 'Appointment (mustBeFuture)',
              required: true,
              value: null,
              validation: { mustBeFuture: true },
            },
            {
              name: 'reminderDate',
              type: 'datetime' as const,
              label: 'Reminder (optional)',
              required: false,
              value: null,
            },
          ],
        },
      ],
    },
    {
      name: 'advanced',
      label: 'Advanced Settings',
      fieldsGroups: [
        {
          groupName: 'advText',
          groupLabel: 'Advanced Text Fields',
          groupFields: [
            {
              name: 'advRequired',
              type: 'text' as const,
              label: 'Required Advanced',
              required: true,
              value: null,
              validation: { minLength: 5 },
            },
            {
              name: 'advUrl',
              type: 'text' as const,
              label: 'URL Field',
              required: false,
              value: null,
              validation: { isUrl: true, maxLength: 500 },
            },
          ],
        },
        {
          groupName: 'advCheckbox',
          groupLabel: 'Extra Toggles',
          groupFields: [
            {
              name: 'toggleA',
              type: 'checkbox' as const,
              label: 'Extra Toggle A',
              required: false,
              value: true,
            },
            {
              name: 'toggleB',
              type: 'checkbox' as const,
              label: 'Extra Toggle B',
              required: false,
              value: false,
            },
          ],
        },
      ],
    },
  ],
};
