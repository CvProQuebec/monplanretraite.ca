
export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  video: string;
  features: {
    title: string;
    items: string[];
  }[];
  conclusion?: string;
}
