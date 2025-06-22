import { Annotation, StateGraph } from '@langchain/langgraph';
import { Injectable, Logger } from '@nestjs/common';
import { AiProviderFactory } from 'src/providers/ai-provider.factory';
import { NotesCreatedDto } from 'src/dtos/notes-created.dto';
import { Models, Providers } from 'src/enums/models.enums';
import { Nodes } from 'src/enums/nodes.enums';
import { generateSummaryPrompt } from 'src/prompts/generateSummary.prompt';
import { z } from 'zod';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);
  constructor(private readonly aiProviderFactory: AiProviderFactory) {}
  StateAnnotation = Annotation.Root({
    notes: Annotation<NotesCreatedDto>,
    summary: Annotation<string>,
    vectors: Annotation<number[][]>,
  });

  zodStructureForSummary = z.object({
    summary: z.string().describe('The summary of the notes'),
  });
  vectorize = async (state: typeof this.StateAnnotation.State) => {
    this.logger.log('VECTORIZE >>>>>>>>>>>');
    const llm = this.aiProviderFactory.getEmbeddingsLLM(
      Providers.OPENAI,
      Models.GPT_TEXT_EMBEDDING_3_SMALL,
    );
    const embeddings = await llm.embedDocuments([state.summary]);
    this.logger.debug('EMBEDDINGS >>>>>>>>>>>');
    this.logger.debug(embeddings);
    return { vectors: embeddings as unknown as number[][] };
  };

  generateSummary = async (
    state: typeof this.StateAnnotation.State,
  ): Promise<{ summary: string }> => {
    this.logger.log('GENERATING SUMMARY >>>>>>>>>>>');
    const llmWithStructuredOutput = this.aiProviderFactory
      .getLLM(Providers.OPENAI, Models.GPT_O3_MINI)
      .withStructuredOutput(this.zodStructureForSummary);
    const prompt = generateSummaryPrompt();
    const formattedPrompt = await prompt.format({ notes: state.notes.content });

    const response = await llmWithStructuredOutput.invoke(formattedPrompt);
    this.logger.debug('GENERATED SUMMARY >>>>>>>>>>>');
    this.logger.debug(response);

    return { summary: response.summary };
  };

  saveToVectorStore = (state: typeof this.StateAnnotation.State) => {
    this.logger.log('SAVING TO VECTOR STORE');
    this.logger.log(`Saving ${state.vectors.length} dimensions.`);
    return {};
  };

  /**
   * START -> GENERATE SUMMARY -> VECTORIZE -> SAVE TO VECTOR STORE -> END
   */

  workflow = new StateGraph(this.StateAnnotation)
    .addNode(Nodes.GenerateSummary, this.generateSummary)
    .addNode(Nodes.Vectorize, this.vectorize)
    .addNode(Nodes.SaveToVectorStore, this.saveToVectorStore)
    .addEdge(Nodes.Start, Nodes.GenerateSummary)
    .addEdge(Nodes.GenerateSummary, Nodes.Vectorize)
    .addEdge(Nodes.Vectorize, Nodes.SaveToVectorStore)
    .addEdge(Nodes.SaveToVectorStore, Nodes.End)
    .compile();

  async handleNotesCreated(note: NotesCreatedDto) {
    const result = await this.workflow.invoke({ notes: note });
    this.logger.debug('RESULT >>>>>>>>>>>');
    this.logger.debug(result);
    // PUSH TO KAFKA WITH STATUS
  }
}
