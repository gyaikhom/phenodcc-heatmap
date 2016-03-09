/*
 * Copyright 2013 Medical Research Council Harwell.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.mousephenotype.dcc.heatmap.entities;

import java.io.Serializable;
import java.util.List;
import javax.xml.bind.annotation.XmlElement;

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
public class Heatmap implements Serializable {
    private String title;
    private List<RowEntry> rowEntries;
    private List<ColumnEntry> columnEntries;
    private SignificanceEntry[][] significance;
    
    public Heatmap(String title, List<RowEntry> rowEntries,
            List<ColumnEntry> columnEntries,
            SignificanceEntry[][] significance) {
        this.title = title;
        this.rowEntries = rowEntries;
        this.columnEntries = columnEntries;
        this.significance = significance;
    }
    
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

     @XmlElement(name = "row_headers")
    public List<RowEntry> getRowEntries() {
        return rowEntries;
    }

    public void setRowEntries(List<RowEntry> rowEntries) {
        this.rowEntries = rowEntries;
    }

     @XmlElement(name = "column_headers")
    public List<ColumnEntry> getColumnEntries() {
        return columnEntries;
    }

    public void setColumnEntries(List<ColumnEntry> columnEntries) {
        this.columnEntries = columnEntries;
    }

     @XmlElement(name = "significance")
    public SignificanceEntry[][] getSignificance() {
        return significance;
    }

    public void setSignificance(SignificanceEntry[][] significance) {
        this.significance = significance;
    }

}
