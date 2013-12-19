#! /bin/bash

pandoc -o design.html --toc --self-contained -H style.html design.md;
