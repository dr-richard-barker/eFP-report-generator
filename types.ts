
export enum ViewerType {
  TissueExpression = 'Tissue Expression (eFP)',
  InteractionNetwork = 'Interaction Network',
  SubcellularLocalization = 'Subcellular Localization',
  WorldMap = 'World eFP',
  PlantAnatomy = 'Plant Anatomy',
}

export interface AnalysisOptions {
  geneList: string;
  viewers: ViewerType[];
}

export interface GoTerm {
  go_id: string;
  name: string;
  p_value: number;
  study_count: number;
}

export interface GeneVisual {
  viewerType: ViewerType;
  description: string;
  imageUrl: string;
}

export interface GeneResult {
  id: string;
  visuals: GeneVisual[];
}

export interface AnalysisResult {
  goEnrichment: GoTerm[];
  geneResults: GeneResult[];
}

export enum AnalysisState {
    Idle = 'idle',
    Loading = 'loading',
    Success = 'success',
    Error = 'error',
}
