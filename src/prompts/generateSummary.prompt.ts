import { PromptTemplate } from '@langchain/core/prompts';

// export function generateSummaryPrompt(note: NotesCreatedDto) {
//   return `
//     System: You are a utility model that generates summary of the notes content in such a way that
//     it can be used to generate further contents by the LLM models.
//     Notes: ${note.content}
//   `;
// }

export function generateSummaryPrompt(): PromptTemplate {
  return new PromptTemplate({
    template: `
    System: You are a utility model that generates summary of the notes content in such a way that 
    it can be used to generate further contents by the LLM models.
    Notes: {notes}
    `,
    inputVariables: ['notes'],
  });
}
