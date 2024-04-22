import { Injectable } from '@angular/core';

@Injectable( {
      providedIn: 'root'
} )
export class GenerativeService {


      async generateImage ( prompt: string ) {
            // TODO: get from Vertex
            const image = {
                  id: 4,
                  title: "Woman with a fox",
                  audio: "assets/audio/1.mp3",
                  date: "1889",
                  description:
                        `The image showcases a young woman, dressed in an opulent orange kimono adorned with intricate patterns and gold embellishments. Her hair is styled elegantly with a vibrant orange flower tucked behind her ear. She gazes serenely at the viewer with a gentle expression. The woman holds a majestic red fox with thick fur, its eyes locked onto something beyond the frame. Golden butterflies and leaves flutter around them, creating a sense of enchantment and movement. The background is a rich tapestry of teal and brown hues, adding depth and contrast to the scene.
                        The image is crafted in a style that blends realism with elements of fantasy and romanticism.The meticulous attention to detail in the woman's attire, the fox's fur, and the surrounding foliage is characteristic of realism.However, the presence of golden butterflies, the intense colors, and the overall ethereal atmosphere evoke a sense of fantasy and dreamlike beauty, typical of romanticism.The artist masterfully uses light and shadow to create a three- dimensional effect and enhance the emotional impact of the scene.
                        The Juxtaposition of Beauty and Mystery: The image presents a captivating blend of feminine beauty and the enigmatic presence of the fox. The woman's serene expression contrasts with the fox's alert gaze, creating a sense of mystery and prompting viewers to wonder about their relationship and the story behind the scene.
                        `,
                  height: 93,
                  url: "assets/artworks/d8.jpeg",
                  prompt: 'A woman in traditional Japaneese clothing and her pet fox',
                  votes: 56,
                  width: 74,
                  wiki: "https://en.wikipedia.org/wiki/Vase_with_Irises_Against_a_Yellow_Background",
                  colors: [
                        "rgb(16, 96, 139)",
                        "rgb(92, 139, 148)",
                        "rgb(63, 107, 72)",
                        "rgb(134, 120, 165)",
                        "rgb(12, 46, 87)",
                        "rgb(243, 232, 85)",
                        "rgb(124, 158, 162)",
                        "rgb(246, 242, 132)",
                        "rgb(227, 208, 101)",
                        "rgb(168, 128, 183)",
                  ],
            };
            return image;
      }
}
