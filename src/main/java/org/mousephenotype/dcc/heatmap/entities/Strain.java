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
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
@Entity
@Table(name = "strain", catalog = "phenodcc_overviews", schema = "")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Strain.findAll", query = "SELECT s FROM Strain s"),
    @NamedQuery(name = "Strain.findByStrainId", query = "SELECT s FROM Strain s WHERE s.strainId = :strainId"),
    @NamedQuery(name = "Strain.findByStrain", query = "SELECT s FROM Strain s WHERE s.strain = :strain"),
    @NamedQuery(name = "Strain.findByMgiStrainId", query = "SELECT s FROM Strain s WHERE s.mgiStrainId = :mgiStrainId")})
public class Strain implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "strain_id", nullable = false)
    private Integer strainId;
    @Size(max = 255)
    @Column(length = 255)
    private String strain;
    @Size(max = 255)
    @Column(name = "mgi_strain_id", length = 255)
    private String mgiStrainId;

    public Strain() {
    }

    public Strain(Integer strainId) {
        this.strainId = strainId;
    }

    public Integer getStrainId() {
        return strainId;
    }

    public void setStrainId(Integer strainId) {
        this.strainId = strainId;
    }

    public String getStrain() {
        return strain;
    }

    public void setStrain(String strain) {
        this.strain = strain;
    }

    public String getMgiStrainId() {
        return mgiStrainId;
    }

    public void setMgiStrainId(String mgiStrainId) {
        this.mgiStrainId = mgiStrainId;
    }
}
