// Bulletin d'adhésion Toulibre
// Compilation : typst compile bulletin/bulletin-adhesion.typ public/static/pdf/bulletin-adhesion-toulibre.pdf

#let orange = rgb("#F5A623")
#let jaune = rgb("#FFC84A")
#let brun = rgb("#8B4513")
#let noir = rgb("#1A1A1A")
#let creme = rgb("#FFE0A0")
#let gris = rgb("#666666")
#let gris-clair = rgb("#E5E5E5")

#set page(
  paper: "a4",
  margin: (x: 1.8cm, top: 1.4cm, bottom: 1.4cm),
)

#set text(
  font: ("Inter", "Helvetica Neue", "Arial"),
  size: 10.5pt,
  lang: "fr",
  fill: noir,
)

#set par(leading: 0.7em, justify: false)

// Champ à remplir : label au-dessus, ligne en dessous
#let champ(label, width: 100%, hauteur: 1.2cm) = block(
  width: width,
  inset: (top: 0pt, bottom: 0pt),
)[
  #text(size: 8.5pt, fill: gris, weight: "medium")[#upper(label)]
  #v(hauteur - 0.1cm, weak: true)
  #line(length: 100%, stroke: 0.6pt + noir)
]

// Section header
#let section(titre) = [
  #v(0.25cm)
  #block(
    width: 100%,
    inset: (bottom: 3pt),
    stroke: (bottom: 1pt + orange),
  )[
    #text(size: 12pt, weight: "bold", fill: brun)[#titre]
  ]
  #v(0.2cm)
]

// ===== EN-TÊTE =====

#grid(
  columns: (1fr, auto),
  align: (left + horizon, right + horizon),
  image("../public/static/img/logo_toulibre.svg", height: 1.8cm),
  align(right)[
    #text(size: 9pt, fill: gris, weight: "medium")[
      Association loi 1901 \
      14 avenue Aristide Briand \
      31400 Toulouse \
      #link("https://toulibre.org")[toulibre.org]
    ]
  ],
)

#v(0.5cm)

// ===== TITRE =====

#text(size: 26pt, weight: "bold", fill: noir)[
  Bulletin d'adhésion
]

#v(0.15cm)

#text(size: 11pt, fill: gris)[
  Soutenez la promotion du Logiciel Libre en Occitanie.
]

#v(0.4cm)

#block(
  fill: creme,
  inset: 10pt,
  radius: 6pt,
  width: 100%,
)[
  #text(size: 9.5pt, fill: brun)[
    *L'adhésion à Toulibre* est de #text(weight: "bold")[10 € minimum par an], de date à date.
    Elle vous permet de soutenir l'association et de participer à ses décisions
    en assemblée générale.
  ]
]

// ===== FORMULAIRE =====

#section("Vos informations")

#grid(
  columns: (1fr, 1fr),
  column-gutter: 0.8cm,
  row-gutter: 0.4cm,
  champ("Prénom"),
  champ("Nom"),
)

#v(0.4cm)

#champ("Adresse e-mail")

// ===== ADHÉSION =====

#section("Mon adhésion")

#grid(
  columns: (1fr, 1fr),
  column-gutter: 0.8cm,
  [
    #text(size: 8.5pt, fill: gris, weight: "medium")[#upper("Montant de l'adhésion")]
    #v(1.1cm, weak: true)
    #stack(
      dir: ltr,
      spacing: 0.4cm,
      box(width: 4cm, stroke: (bottom: 0.6pt + noir), height: 0.4cm)[],
      text(size: 12pt, weight: "bold")[€],
    )
    #v(0.1cm)
    #text(size: 8pt, fill: gris)[10 € minimum]
  ],
  [
    #text(size: 8.5pt, fill: gris, weight: "medium")[#upper("Date")]
    #v(1.1cm, weak: true)
    #line(length: 100%, stroke: 0.6pt + noir)
    #v(0.1cm)
    #text(size: 8pt, fill: gris)[JJ / MM / AAAA]
  ],
)

#v(0.5cm)

#text(size: 8.5pt, fill: gris, weight: "medium")[#upper("Signature")]
#v(0.15cm)

#block(
  width: 100%,
  height: 1.8cm,
  stroke: (paint: gris-clair, thickness: 0.6pt, dash: "dashed"),
  radius: 4pt,
)[]

// ===== MODALITÉS =====

#section("Comment régler ?")

#grid(
  columns: (1fr, 1fr, 1fr),
  column-gutter: 0.6cm,
  [
    #text(weight: "bold", fill: brun, size: 10pt)[Chèque]
    #v(0.15cm)
    #text(size: 9pt, fill: gris)[
      À l'ordre de \«\u{00A0}Toulibre\u{00A0}\», à adresser au siège social.
    ]
  ],
  [
    #text(weight: "bold", fill: brun, size: 10pt)[Espèces]
    #v(0.15cm)
    #text(size: 9pt, fill: gris)[
      Lors d'un événement Toulibre (QJELT, permanence, Capitole du Libre…).
    ]
  ],
  [
    #text(weight: "bold", fill: brun, size: 10pt)[Virement]
    #v(0.15cm)
    #text(size: 9pt, fill: gris)[
      Coordonnées bancaires sur demande à #link("mailto:contact@toulibre.org")[contact\@toulibre.org].
    ]
  ],
)

#v(0.3cm)

#block(
  fill: rgb("#FAFAFA"),
  stroke: 0.5pt + gris-clair,
  inset: 8pt,
  radius: 4pt,
  width: 100%,
)[
  #text(size: 8.5pt, fill: gris)[
    *Adresser ce bulletin* accompagné du règlement à :
    *Toulibre — 14 avenue Aristide Briand, 31400 Toulouse*, \
    ou nous le remettre directement lors d'un événement.
  ]
]

// ===== PIED DE PAGE =====

#place(
  bottom + center,
  dy: 0.5cm,
  block(width: 100%)[
    #line(length: 100%, stroke: 0.5pt + gris-clair)
    #v(0.2cm)
    #grid(
      columns: (1fr, auto, 1fr),
      align: (left + horizon, center + horizon, right + horizon),
      text(size: 8pt, fill: gris)[
        #link("https://toulibre.org")[toulibre.org]
      ],
      text(size: 8pt, fill: gris, weight: "medium")[
        Promouvoir, développer et démocratiser le Logiciel Libre en Occitanie
      ],
      text(size: 8pt, fill: gris)[
        #link("mailto:contact@toulibre.org")[contact\@toulibre.org]
      ],
    )
  ],
)
