<!--
Copyright 2013 Medical Research Council Harwell.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

@author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>

-->

<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
    <head>
        <title>PhenoDCC HeatMap (Development Version)</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <link href="https://www.mousephenotype.org/data/css/default.css" rel="stylesheet" type="text/css" />
            <!--[if !IE]><!-->
            <link rel="stylesheet" type="text/css" href="css/heatmap.css"/>
            <!--<![endif]-->
            <!--[if IE 8]>
            <link rel="stylesheet" type="text/css" href="css/heatmapIE8.css">
            <![endif]-->
            <!--[if gte IE 9]>
            <link rel="stylesheet" type="text/css" href="css/heatmap.css">
            <![endif]-->
    </head>
    <body>
        <div id="phenodcc-heatmap" style="width:100%;"></div>

        <script type="text/javascript" src="js/heatmap.js"></script>
        <!--[if IE 8]>
        <script type="text/javascript">
        dcc.ie8 = true;
        </script>
        <![endif]-->

        <script>            
            new dcc.PhenoHeatMap({
                /* identifier of <div> node that will host the heatmap */
                'container': 'phenodcc-heatmap',
                /* colony identifier (MGI identifier) */
                'mgiid': '<%= request.getParameter("mgiid")%>',
                /* default usage mode: ontological or procedural */
                'mode': 'ontological',
                /* number of phenotype columns to use per section */
                'ncol': 5,
                'url': {
                    /* the base URL of the heatmap javascript source */
                    'jssrc': 'js/',
                    /* the base URL of the heatmap data source */
                    'json': 'rest/'
                }
            });            
        </script>
    </body>
</html>
