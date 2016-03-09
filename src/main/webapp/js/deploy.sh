#! /bin/bash
#
# Copyright 2013 Medical Research Council Harwell.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
#
# @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
#

# Minify Javascript
java -jar /opt/yuicompressor/yuicompressor-2.4.7.jar -o heatmap.DCC_HEATMAP_VERSION.js heatmap.js;

# Minify CSS
java -jar /opt/yuicompressor/yuicompressor-2.4.7.jar -o ../css/heatmap.DCC_HEATMAP_VERSION.css ../css/heatmap.css;
java -jar /opt/yuicompressor/yuicompressor-2.4.7.jar -o ../css/heatmapIE8.DCC_HEATMAP_VERSION.css ../css/heatmapIE8.css;

# Add copyright notice
case `uname -s` in
    Darwin)
        sed -i "" "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" ../css/heatmap.DCC_HEATMAP_VERSION.css;
        sed -i "" "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" ../css/heatmapIE8.DCC_HEATMAP_VERSION.css;
        sed -i "" "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" heatmap.DCC_HEATMAP_VERSION.js;
        ;;
    *)
        sed -i "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" ../css/heatmap.DCC_HEATMAP_VERSION.css;
        sed -i "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" ../css/heatmapIE8.DCC_HEATMAP_VERSION.css;
        sed -i "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" heatmap.DCC_HEATMAP_VERSION.js;
        ;;
esac

##############################################################################
# Heatmap included by Phenoview
##############################################################################
# Minify Javascript
java -jar /opt/yuicompressor/yuicompressor-2.4.7.jar -o phenoview.DCC_HEATMAP_VERSION.js phenoview.js;

# Minify CSS
java -jar /opt/yuicompressor/yuicompressor-2.4.7.jar -o ../css/phenoview.DCC_HEATMAP_VERSION.css ../css/phenoview.css;
java -jar /opt/yuicompressor/yuicompressor-2.4.7.jar -o ../css/phenoviewIE8.DCC_HEATMAP_VERSION.css ../css/phenoviewIE8.css;

# Add copyright notice
case `uname -s` in
    Darwin)
        sed -i "" "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" ../css/phenoview.DCC_HEATMAP_VERSION.css;
        sed -i "" "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" ../css/phenoviewIE8.DCC_HEATMAP_VERSION.css;
        sed -i "" "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" phenoview.DCC_HEATMAP_VERSION.js;
        ;;
    *)
        sed -i "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" ../css/phenoview.DCC_HEATMAP_VERSION.css;
        sed -i "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" ../css/phenoviewIE8.DCC_HEATMAP_VERSION.css;
        sed -i "1s/^/\/* Copyright 2013 Medical Research Council Harwell *\//" phenoview.DCC_HEATMAP_VERSION.js;
        ;;
esac

# Generate the documentation
cd ../doc;
./prepare.sh;
cd ..;
cp doc/manual.html .;
rm -Rf doc;
