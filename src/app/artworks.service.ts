import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class ArtworksService {
  // TODO: change to signal
  private artworksArray: Artwork[] = [
    {
      id: 0,
      title: "Self Portrait",
      audio: "assets/audio/1.mp3",
      date: "1887",
      description:
        "This self-portrait was one of about 32 produced over a 10-year period, and these were an important part of his work as a painter; he painted himself because he often lacked the money to pay for models. Art historians are divided as to whether this painting is Van Gogh's final self-portrait or not. It is considered that it was painted in Arles following Van Gogh's admission to hospital after mutilating his ear. Van Gogh sent the picture to his younger brother, the art dealer Theo; an accompanying letter read: 'I hope you will notice that my facial expressions have become much calmer, although my eyes have the same insecure look as before, or so it appears to me.'",
      height: 65,
      url: "assets/artworks/Designer_0.webp",
      votes: 0,
      width: 54,
      wiki: "https://wikipedia.org/wiki/Van_Gogh_self-portrait_(1889)",
      colors: [
        "rgb(165, 187, 206)",
        "rgb(131, 162, 181)",
        "rgb(154, 191, 176)",
        "rgb(191, 154, 154)",
        "rgb(109, 134, 119)",
        "rgb(170, 198, 177)",
        "rgb(81, 108, 119)",
        "rgb(247, 186, 143)",
        "rgb(152, 213, 140)",
        "rgb(102, 102, 144)",
        "rgb(142, 182, 198)",
      ],
    },
    {
      id: 0,
      title: "Self Portrait",
      audio: "assets/audio/1.mp3",
      date: "1887",
      description:
        "This self-portrait was one of about 32 produced over a 10-year period, and these were an important part of his work as a painter; he painted himself because he often lacked the money to pay for models. Art historians are divided as to whether this painting is Van Gogh's final self-portrait or not. It is considered that it was painted in Arles following Van Gogh's admission to hospital after mutilating his ear. Van Gogh sent the picture to his younger brother, the art dealer Theo; an accompanying letter read: 'I hope you will notice that my facial expressions have become much calmer, although my eyes have the same insecure look as before, or so it appears to me.'",
      height: 65,
      url: "assets/artworks/selfportrait.webp",
      votes: 0,
      width: 54,
      wiki: "https://wikipedia.org/wiki/Van_Gogh_self-portrait_(1889)",
      colors: [
        "rgb(165, 187, 206)",
        "rgb(131, 162, 181)",
        "rgb(154, 191, 176)",
        "rgb(191, 154, 154)",
        "rgb(109, 134, 119)",
        "rgb(170, 198, 177)",
        "rgb(81, 108, 119)",
        "rgb(247, 186, 143)",
        "rgb(152, 213, 140)",
        "rgb(102, 102, 144)",
        "rgb(142, 182, 198)",
      ],
    },
    {
      id: 1,
      title: "Almond Blossom",
      audio: "assets/audio/2.mp3",
      date: "1890",
      description:
        "In mid-March 1888 van Gogh writes that the almond trees are coming into full flower, weather there is changeable, often windy with turbulent skies. Later on Theo wrote to his brother Vincent on January 31, 1890, to announce the birth of his son, Vincent Willem van Gogh. He was very close to his brother and he sought to symbolize new life in the flowers of the almond tree for the birth of baby Vincent.",
      height: 73.5,
      url: "assets/artworks/almond_blossom.webp",
      votes: 34,
      width: 92,
      colors: [
        "rgb(165, 206, 205)",
        "rgb(158, 176, 150)",
        "rgb(112, 148, 138)",
        "rgb(186, 198, 169)",
        "rgb(100, 146, 158)",
        "rgb(85, 124, 150)",
        "rgb(173, 183, 148)",
        "rgb(46, 59, 48)",
        "rgb(112, 113, 65)",
        "rgb(117, 154, 96)",
        "rgb(53, 89, 109)",
        "rgb(107, 185, 176)",
        "rgb(255, 189, 152)",
      ],
      wiki: "https://en.wikipedia.org/wiki/Almond_Blossoms",
    },
    {
      id: 2,
      title: "The Bedroom",
      audio: "assets/audio/3.mp3",
      date: "1887",
      description:
        "The painting depicts van Gogh's bedroom at 2, Place Lamartine in Arles, Bouches-du-Rhone, France, known as the Yellow House. The door to the right opened on to the upper floor and the staircase; the door to the left was that of the guest room he held prepared for Gauguin; the window in the front wall looked on to Place Lamartine and its public gardens. This room was not rectangular but trapezoid with an obtuse angle in the left hand corner of the front wall and an acute angle at the right.",
      height: 72.4,
      url: "assets/artworks/bedroom.webp",
      votes: 65,
      width: 91.3,
      colors: [
        "rgb(194, 206, 165)",
        "rgb(159, 182, 197)",
        "rgb(241, 167, 163)",
        "rgb(194, 52, 41)",
        "rgb(251, 163, 63)",
        "rgb(142, 189, 155)",
        "rgb(171, 156, 63)",
        "rgb(141, 174, 204)",
        "rgb(31, 74, 59)",
        "rgb(100, 146, 158)",
        "rgb(210, 204, 143)",
        "rgb(159, 182, 197)",
      ],
      wiki: "https://wikipedia.org/wiki/Bedroom_in_Arles",
    },
    {
      id: 3,
      title: "Sunflowers",
      audio: "assets/audio/1.mp3",
      date: "1887",
      description:
        "This is one of five versions of Sunflowers on display in museums and galleries across the world. Van Gogh made the paintings to decorate his house in Arles in readiness for a visit from his friend and fellow artist, Paul Gauguin.'The sunflower is mine', Van Gogh once declared, and it is clear that the flower had various meanings for him. The different stages in the sunflower's life cycle shown here, from young bud through to maturity and eventual decay, follow in the vanitas tradition of Dutch seventeenth-century flower paintings, which emphasise the transient nature of human actions. The sunflowers were perhaps also intended to be a symbol of friendship and a celebration of the beauty and vitality of nature.",
      height: 95,
      url: "assets/artworks/sunflowers.webp",
      votes: 72,
      width: 73,
      // download:
      // "https://en.wikipedia.org/wiki/File:Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg",
      wiki: "https://wikipedia.org/wiki/Sunflowers_(Van_Gogh_series)",
      colors: [
        "rgb(245, 238, 141)",
        "rgb(197, 188, 46)",
        "rgb(166, 169, 22)",
        "rgb(62, 84, 8)",
        "rgb(120, 138, 139)",
        "rgb(146, 171, 42)",
        "rgb(65, 87, 66)",
        "rgb(154, 172, 59)",
        "rgb(167, 149, 190)",
        "rgb(218, 216, 155)",
      ],
    },
    {
      id: 4,
      title: "Irises",
      audio: "assets/audio/1.mp3",
      date: "1889",
      description:
        "Van Gogh painted this still life in the psychiatric hospital in Saint-Remy. For him, the painting was mainly a study in color. He set out to achieve a powerful color contrast. By placing the purple flowers against a yellow background, he made the decorative forms stand out even more strongly. The irises were originally purple. But as the red pigment has faded, they have turned blue. Van Gogh made two paintings of this bouquet. In the other still life, he contrasted purple and pink with green.",
      height: 93,
      url: "assets/artworks/irises.webp",
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
    },
  ];

  public artworks = signal( this.artworksArray );
  public focusedArtwork = signal( this.artworksArray[0] );

  getFocusedArtwork () {
    return this.focusedArtwork();
  }

  addArtwork ( artwork: Artwork ) {
    artwork.id = this.artworksArray.length;
    this.focusedArtwork.set( artwork );
    this.artworksArray.push( artwork );
  }
}

export interface Artwork {
  id?: number;
  audio?: string;
  date?: string;
  defaultPosition?: any;
  defaultRotation?: any;
  description?: string;
  height?: number;
  url: string;
  title?: string;
  votes?: number;
  width?: number;
  wiki?: string;
  colors?: string[];
}
