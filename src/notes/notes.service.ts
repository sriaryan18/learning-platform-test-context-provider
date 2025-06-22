import { Annotation, StateGraph } from '@langchain/langgraph';
import { Injectable, Logger } from '@nestjs/common';
import {
  ChatLLMService,
  EmbeddingsService,
} from 'src/providers/llms/ai-services.interface';
import { VectorRepository } from 'src/providers/vectorDB/vectors.repository.interface';
import { NotesCreatedDto } from 'src/dtos/notes-created.dto';
import { Nodes } from 'src/enums/nodes.enums';
import { generateSummaryPrompt } from 'src/prompts/generateSummary.prompt';
import { z } from 'zod';
import { PineconeRecord } from '@pinecone-database/pinecone';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);
  constructor(
    private readonly chatLLMService: ChatLLMService,
    private readonly embeddingsService: EmbeddingsService,
    private readonly vectorRepository: VectorRepository,
  ) {}
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
    const embeddingsLLM = this.embeddingsService.getInstance();
    const embeddings = await embeddingsLLM.embedDocuments([state.summary]);
    this.logger.debug('EMBEDDINGS >>>>>>>>>>>');
    this.logger.debug(embeddings);
    return { vectors: embeddings as unknown as number[][] };
  };

  generateSummary = async (
    state: typeof this.StateAnnotation.State,
  ): Promise<{ summary: string }> => {
    this.logger.log('GENERATING SUMMARY >>>>>>>>>>>');
    const chatLLM = this.chatLLMService.getInstance();
    const llmWithStructuredOutput = chatLLM.withStructuredOutput(
      this.zodStructureForSummary,
    );
    const prompt = generateSummaryPrompt();
    const formattedPrompt = await prompt.format({ notes: state.notes.content });

    const response = await llmWithStructuredOutput.invoke(formattedPrompt);
    this.logger.debug('GENERATED SUMMARY >>>>>>>>>>>');
    this.logger.debug(response);

    return { summary: response.summary };
  };

  saveToVectorStore = async (state: typeof this.StateAnnotation.State) => {
    this.logger.log('SAVING TO VECTOR STORE');
    this.logger.log(`Saving ${state.vectors.length} dimensions.`);

    // Generate a unique ID for this note
    const noteId = `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create vector records for storage
    const records: PineconeRecord[] = state.vectors.map((vector, index) => ({
      id: `${noteId}-${index}`,
      values: vector,
      metadata: {
        noteId: noteId,
        summary: state.summary,
        content: state.notes.content,
        createdAt: new Date().toISOString(),
      },
    }));

    // Save to vector store using the injected repository
    await this.vectorRepository.save('notes', records);
    this.logger.log('Successfully saved vectors to store');

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
