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

current_dir=`pwd`;

SOURCE="${BASH_SOURCE[0]}"
DIR="$( dirname "$SOURCE" )"
while [ -h "$SOURCE" ]
do 
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
    DIR="$( cd -P "$( dirname "$SOURCE"  )" && pwd )"
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

if [ $DIR = $current_dir ]
then
    echo "Cannot run script from the same directory where the script resides.";
    echo "Please run script from a different directory, e.g.,";
    echo "";
    echo "mkdir ~/deploy_dir";
    echo "cd ~/deploy_dir";
    echo "~/path/to/project/how-to-deploy/package.sh ~/path/to/project localhost";
    exit;
fi

src_dir=$1;
project=`basename ${src_dir}`;

case $2 in
    localhost) type=1
        ;;
    live) type=2
        ;;
    *)
        echo "Please specify the build target."
        echo ""
        echo "    USAGE: package.sh source_dir [localhost | live]"
        exit
        ;;
esac

echo "Poject name: ${project}";
echo "Source directory: ${src_dir}";
echo "--------------------------------------------------------------------------------";

echo "Copying project source directory...";
cp -Rf $1 ./;
cd ${project};
version=`grep -oP -m 1 -e '<version>\d{1,}\.[0-9]{1,}(\.[0-9]{1,})?' pom.xml | cut -d\> -f2`;
echo "Package version from pom.xml: ${version}";
echo "Setting source files to version...";

case `uname -s` in
    Darwin)
        sed -i "" "s/DCC_HEATMAP_VERSION/${version}/g" src/main/webapp/index.jsp;
        sed -i "" "s/DCC_HEATMAP_VERSION/${version}/g" src/main/webapp/js/heatmap.js;
        sed -i "" "s/DCC_HEATMAP_VERSION/${version}/g" src/main/webapp/js/deploy.sh;
        ;;
    *)
        sed -i "s/DCC_HEATMAP_VERSION/${version}/g" src/main/webapp/index.jsp;
        sed -i "s/DCC_HEATMAP_VERSION/${version}/g" src/main/webapp/js/heatmap.js;
        sed -i "s/DCC_HEATMAP_VERSION/${version}/g" src/main/webapp/js/deploy.sh;
        ;;
esac

echo "Generating optimised web application...";
(cd src/main/webapp/js/ && ./deploy.sh);

echo "Cleaning project and removing unnecessary files and directories...";
mvn -q clean;
rm -Rf .git .gitignore how-to-deploy src/main/webapp/js/heatmap.js src/main/webapp/css/heatmap.css src/main/webapp/css/heatmapIE8.css src/main/webapp/dev.jsp src/main/webapp/js/deploy.sh;
find src -iname "*.svg" -type f -delete;
find src -iname "*.xcf" -type f -delete;

echo "Building war...";
cd ${current_dir}/${project};
mvn -q -DskipTests -P $2 package;

echo "Extracting war file, and deleting source directory...";
cd ${current_dir};
mv ${current_dir}/${project}/target/${project}-${version}.war ./;
rm -Rf ${current_dir}/${project};

echo "All done...";
