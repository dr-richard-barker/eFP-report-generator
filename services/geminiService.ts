
import { GoogleGenAI, Type } from "@google/genai";
import { type GeneVisual, type GoTerm, ViewerType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper function to introduce a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateGoEnrichment(geneList: string): Promise<GoTerm[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Given the following list of gene identifiers: ${geneList}. Perform a mock Gene Ontology (GO) enrichment analysis. Return a JSON array of the top 5 most enriched biological process terms. Each object in the array must have the following properties: "go_id" (e.g., "GO:0006950"), "name" (e.g., "response to stress"), "p_value" (a float between 0.0 and 0.05), and "study_count" (an integer representing how many genes from the list are in this term).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              go_id: { type: Type.STRING },
              name: { type: Type.STRING },
              p_value: { type: Type.NUMBER },
              study_count: { type: Type.INTEGER },
            },
            required: ["go_id", "name", "p_value", "study_count"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as GoTerm[];
  } catch (error) {
    console.error("Error generating GO enrichment:", error);
    throw new Error("Failed to generate GO enrichment data from Gemini API.");
  }
}

export async function generateGeneVisuals(geneId: string, viewers: ViewerType[]): Promise<GeneVisual[]> {
  const results: GeneVisual[] = [];

  for (const viewer of viewers) {
    try {
      // Add a delay before each set of API calls to avoid rate limiting.
      // A 1.1 second delay ensures we stay under the typical 60 requests/minute limit.
      await sleep(1100);
      
      // Step 1: Generate a specific, data-rich description for the visualization.
      const descriptionResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `For the gene identifier "${geneId}" and the ePlant viewer "${viewer}", provide a one-sentence, concise, scientific-sounding description of what the visualization might show. Be specific about the results, for example: "This gene shows high expression in root vascular tissue and trichomes." or "The protein interacts with key transcription factors involved in stress response."`,
      });
      const description = descriptionResponse.text.trim();

      // Add another delay between the text and image generation calls.
      await sleep(1100);
      
      // Step 2: Generate an image that visually represents the specific description.
      const imageResponse = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: `Create a scientific eFP browser visualization for the gene ${geneId}. The visualization should be a "${viewer}" view. Crucially, the image must visually represent the following finding: "${description}". The style should be clean, scientific, and resemble a figure from a research paper.`,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '4:3',
          },
      });
      
      if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
        throw new Error("Image generation failed to return an image.");
      }
      const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

      results.push({
        viewerType: viewer,
        description,
        imageUrl,
      });
    } catch (error) {
      console.error(`Error generating visual for ${geneId} - ${viewer}:`, error);
      // In case of an error for one visual, create a placeholder and continue
      results.push({
        viewerType: viewer,
        description: `Could not generate description or visualization for ${viewer}.`,
        imageUrl: `https://via.placeholder.com/600x400.png?text=Error+Generating+Image`,
      });
    }
  }

  return results;
}