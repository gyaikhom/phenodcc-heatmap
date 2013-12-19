% Users' Manual: _Procedural and Ontological Heatmap Web Application_
% Gagarine Yaikhom
% Last updated: 22 April 2013

# Introduction

The _PhenoDCC Procedural and Ontological Heatmap_ web application allows
a user to systematically browse phenotype expressions for a given genotype.
It also provides the user with a portal for accessing data visualisations
that correspond to specific phenotype expressions.

The heatmap web application was designed primarily for phenotypers and
scientists who are interested in the knockout effects on mouse phenotype. It is
accessed using a standard web browser, such as Google Chrome, by visiting the
appropriate web application server. It is very likely that the PhenoDCC heatmap
has been embedded inside other web pages (e.g., the gene details page etc.).


# Usage modes

The PhenoDCC heatmap provides the user with two browsing modes. These
are:

* **Procedural mode** - browse by experimental procedures and measured parameters.
* **Ontological mode** - browse by ontological annotations that are associated
    with procedural parameters.

## Procedural mode

In procedural mode, the available categories are listed as pipeline procedures
and measured parameters. This allows the user to visualise phenotype
expressions in relation to experimental procedures carried out on the specimens.
The following shows the PhenoDCC Heatmap in procedural mode:


![Heatmap in _procedural_ mode][procedural]


## Ontological mode

In ontological mode, the available categories are listed as ontology terms.
These terms are determined by the associated meanings defined for specific
variation in the knockout expressions as compared to wild type expressions.
The following shows the PhenoDCC Heatmap in ontological mode:

![Heatmap in _ontological_ mode][ontological]

# The user interface

The user interface for the PhenoDCC Heatmap is organised as follows:

![Organisation of the user interface][interface]

At the top, we have the _toolbar_. This consists of the mode selectors on the
right hand side, and the _breadcrum_ interface for hierarchical navigation on
the left. Below the toolbar is the controls panel, with three components.

## Legends

The first is the group of legends:

1. **Significant** - Defines colour to highlight phenotype cells with
   significant phenotype expressions.

2. **Insignificant** - Defines colour to highlight phenotype cells with no
   significant phenotype expressions.

3. **No data** - Defines the appearance of cells with no phenotype data.

Hovering over the first two legends will show a _colour picker_ pop-up. Clicking
on a colour will set the colour for that legend.

## The _p_-value gradient

The second component is the _Show p-value gradient_ control. This allows a user
to visualise the relative strength of the phenotype expressions of all of the
visible categories, as shown below:

![Relative strength of phenotype expressions as _p_-value gradient][gradient]

## The _p_-value slider

Finally, the last control is the _p_-value slider. This allows a user to
change the _p_-value threshold which determines whether a phenotype
expression is _significant_ or _insignificant_.

![Components of the _p_-value slider][slider]

The value of the _p_-value slider can be altered in two ways:

1. Set the threshold value by entering the value manually in the text
   input box. This is useful when the user knows the exact _p_-value threshold
   that they require.

2. Drag the slider button to apply the required value. This is useful when
   a user wishes to see variations at various thresholds.

The _reset_ button is used to set the _p_-value slider to its default threshold.


# The phenotype cells

Depending on the chosen category, the lower part of the heatmap displays
various cells. These cells are grouped into _sections_. In each section, the
genotype identifier is displayed on the left hand side and cell columns display
phenotype expressions.

The column header cell displays the phenotype category. If a category may be
examined further, these cells are made _clickable_. For instance,
in the following, we are examining the 'Behavior / neurological' ontology
further.

![Further examination of a phenotype category][digin]

The remaining cells on each column represent the phenotype expression for that
category, each row representing one of the genotypes in the colony.

The corresponding _p_-value is displayed inside a phenotype cell. Furthermore,
the background of a cell is coloured according to the colour defined in the
_Significant_ and _Insignificant_ legends.

Where _p_-value gradient is enabled, the cells will be coloured using a gradient
value determined by interpolating between the colours defined by the
_Significant_ and _Insignificant_ legends.

## Hovering over a phenotype cell

Hovering the mouse over a phenotype cell displays a pop-up which lists all of
the significant expressions, as shown below:

![Hovering over a phenotype cell][hover]

## Clicking on a phenotype cell

Clicking on a phenotype cell takes the user to the data visualisation page. This
page consists of context-sensitive visualisations that display the corresponding
measurements.


# Usage on tablet devices

The PhenoDCC Heatmap web application can be used on tablet devices, such as
iPads. Simply open the web application on the browser. The organisation of the
interfaces remains the same as described in section
[The user interface](#the-user-interface). The gesture controls are as follows:

* Drag p-value slider by dragging the slider button.
* To display phenotype expression summary pop-up, tap once on the phenotype cell.
* To display data visualisations that correspond to a
  phenotype cell, press the cell and release it after 1-2 seconds.
* To hide the phenotype expression summary pop-up, or the colour picker, tap
  on the heatmap with two fingers.

***

<div class="footer">Copyright (c) 2013 The International Mouse Phenotyping Consortium</div>

[procedural]: images/procedural.png "Heatmap in _procedural_ mode"
[ontological]: images/ontological.png "Heatmap in _ontological_ mode"
[interface]: images/interface.png "Organisation of the user interface"
[gradient]: images/gradient.png "Relative strength of phenotype expressions as _p_-value gradient"
[hover]: images/hover.png "Hovering over a phenotype cell"
[digin]: images/digin.png "Further examination of a phenotype category"
[slider]: images/slider.png "Components of the _p_-value slider"