
export interface ImagePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export interface TextPart {
  text: string;
}

export type MessagePart = ImagePart | TextPart;

export interface Message {
  id: string;
  role: 'user' | 'model';
  parts: MessagePart[];
}
