PhenoDCC Heatmap
================

The PhenoDCC Heatmap is an interactive web application that provides
a heatmap representation of the annotations associated with a gene. It
has the following features:

1. **Operates in two modes:** In the *procedural* mode, the interface
   is designed to display information in relation to experimental
   procedures as defined in [IMPReSS][impress]. On the other hand, in
   the *ontological* mode the information is displayed in relation to
   the ontological parameters that the gene is associated with.

2. **Embeddable heatmap widget:** Use the Javascript API to embed heatmap
   inside a web page.

## Embed heatmap as widget

Add the following code inside the `<head></head>` of your web-page

    <!--[if !IE]><!-->
        <link rel="stylesheet" type="text/css" href="https://www.mousephenotype.org/heatmap/css/heatmap.<VERSION>.css">
    <!--<![endif]-->
    <!--[if IE 8]>
        <link rel="stylesheet" type="text/css" href="https://www.mousephenotype.org/heatmap/css/heatmapIE8.<VERSION>.css">
    <![endif]-->
    <!--[if gte IE 9]>
        <link rel="stylesheet" type="text/css" href="https://www.mousephenotype.org/heatmap/css/heatmap.<VERSION>.css">
    <![endif]-->

And the following script inside the `<body></body>`

    <script type="text/javascript" src="https://www.mousephenotype.org/heatmap/js/heatmap.<VERSION>.js"></script>
	<!--[if IE 8]>
        <script type="text/javascript">
        dcc.ie8 = true;
        </script>
	<![endif]-->
    <!--[if !IE]><!-->
        <script>
            dcc.heatmapUrlGenerator = function(genotype_id, type) {
                return 'https://www.mousephenotype.org/phenoview?gid=' + genotype_id + '&qeid=' + type;
            };
        </script>
    <!--<![endif]-->
    <!--[if lt IE 9]>
        <script>
            dcc.heatmapUrlGenerator = function(genotype_id, type) {
                return 'https://www.mousephenotype.org/phenotypedata?g=' + genotype_id + '&t=' + type + '&w=all';
            };
        </script>
    <![endif]-->
    <!--[if gte IE 9]>
        <script>
            dcc.heatmapUrlGenerator = function(genotype_id, type) {
                return 'https://www.mousephenotype.org/phenoview?gid=' + genotype_id + '&qeid=' + type;
            };
        </script>
    <![endif]-->
    <script>
          new dcc.PhenoHeatMap({
                /* identifier of <div> node that will host the heatmap */
                'container': 'phenodcc-heatmap',

                /* colony identifier (MGI identifier) */
                'mgiid': 'MGI:1929293',

                /* default usage mode: ontological or procedural */
                'mode': 'ontological',

                /* number of phenotype columns to use per section */
                'ncol': 5,

                /* heatmap title to use */
                'title': 'Cib2',

                'url': {
                    /* the base URL of the heatmap javascript source */
                    'jssrc': 'https://www.mousephenotype.org/heatmap/js/',

                    /* the base URL of the heatmap data source */
                    'json': '//www.mousephenotype.org/heatmap/rest/',

                    /* function that generates target URL for data visualisation */
                    'viz': dcc.heatmapUrlGenerator
                }
            });
    </script>

Replace `<VERSION>` with the correct version number from `pom.xml`.


[impress]: http://www.mousephenotype.org/impress
