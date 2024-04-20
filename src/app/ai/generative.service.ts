import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class GenerativeService {


  async generateImage ( prompt: string ) {
    // TODO: get from Vertex
    const image = {
      url: 'assets/artworks/Designer_2.webp', description: `A Symphony of Light and Color: Describing the Artwork. The image portrays a breathtaking art nouveau hallway bathed in warm sunlight.The scene is a vibrant tapestry of swirling patterns, intricate details, and celestial motifs, creating a truly mesmerizing experience.Here's what a viewer should focus on:

Dominant Features:

      Ceiling: The star of the show is the ceiling, adorned with a mesmerizing depiction of a swirling blue sky, reminiscent of Van Gogh's Starry Night. The golden sun and moon embedded within add a touch of celestial grandeur.
Walls: The walls are covered in a similar swirling pattern, incorporating various shades of blue and gold with hints of green and purple.Paintings depicting figures and landscapes within these swirling patterns further enhance the visual interest.
      Floor: The floor mirrors the ceiling with its swirling design, incorporating warm hues of pink, purple, and orange, grounding the ethereal atmosphere with a touch of earthiness.
Stained Glass Window: At the end of the hallway, a stained glass window bathes the scene in warm sunlight, casting long shadows and creating a sense of depth and tranquility.
Sculptures and Paintings: Sculpted busts and framed paintings are placed along the walls, adding further dimension and narrative to the space.
Important Highlights:

      Interplay of Light and Shadow: Observe how the sunlight from the stained glass window interacts with the swirling patterns and gold embellishments, creating a captivating dance of light and shadow.
Art Nouveau Elements: Notice the characteristic features of art nouveau style, including the organic lines, whiplash curves, and floral motifs that adorn the walls, ceilings, and floor.
Celestial Theme: The sun, moon, and starry sky motif evoke a sense of cosmic wonder and connection with the universe.
Figurative Art: Pay attention to the figures depicted in the paintings and sculptures.Their poses and expressions might offer clues to the     story or theme of the artwork.
Overall Harmony: Appreciate how the various elements – colors, patterns, light, and figures – come together to create a harmonious and visually stunning composition.
Additional Observations:

      The hallway seems to be part of a larger structure, perhaps a museum or a grand mansion.
The people in the hallway appear to be admiring the art and architecture, suggesting the importance of art appreciation and contemplation.
By focusing on these details, viewers can fully appreciate the artistry and symbolism embedded within this captivating artwork.`, title: 'a futuristic hallway with sculptures and paintings on the walls', width: 500, height: 500
    };
    return image;

  }
}
