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
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
@Entity
@Table(name = "centre", catalog = "phenodcc_overviews", schema = "")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Centre.findAll", query = "SELECT c FROM Centre c"),
    @NamedQuery(name = "Centre.findByCentreId", query = "SELECT c FROM Centre c WHERE c.centreId = :centreId"),
    @NamedQuery(name = "Centre.findByFullName", query = "SELECT c FROM Centre c WHERE c.fullName = :fullName"),
    @NamedQuery(name = "Centre.findByShortName", query = "SELECT c FROM Centre c WHERE c.shortName = :shortName"),
    @NamedQuery(name = "Centre.findByAddress", query = "SELECT c FROM Centre c WHERE c.address = :address"),
    @NamedQuery(name = "Centre.findByTelephoneNumber", query = "SELECT c FROM Centre c WHERE c.telephoneNumber = :telephoneNumber"),
    @NamedQuery(name = "Centre.findByContactName", query = "SELECT c FROM Centre c WHERE c.contactName = :contactName"),
    @NamedQuery(name = "Centre.findByUrl", query = "SELECT c FROM Centre c WHERE c.url = :url"),
    @NamedQuery(name = "Centre.findByImitsName", query = "SELECT c FROM Centre c WHERE c.imitsName = :imitsName")})
public class Centre implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "centre_id", nullable = false)
    private Integer centreId;
    @Size(max = 255)
    @Column(name = "full_name", length = 255)
    private String fullName;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 20)
    @Column(name = "short_name", nullable = false, length = 20)
    private String shortName;
    @Size(max = 1024)
    @Column(length = 1024)
    private String address;
    @Size(max = 20)
    @Column(name = "telephone_number", length = 20)
    private String telephoneNumber;
    @Size(max = 255)
    @Column(name = "contact_name", length = 255)
    private String contactName;
    @Size(max = 255)
    @Column(length = 255)
    private String url;
    @Size(max = 55)
    @Column(name = "imits_name", length = 55)
    private String imitsName;

    public Centre() {
    }

    public Centre(Integer centreId) {
        this.centreId = centreId;
    }

    public Centre(Integer centreId, String shortName) {
        this.centreId = centreId;
        this.shortName = shortName;
    }

    public Integer getCentreId() {
        return centreId;
    }

    public void setCentreId(Integer centreId) {
        this.centreId = centreId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTelephoneNumber() {
        return telephoneNumber;
    }

    public void setTelephoneNumber(String telephoneNumber) {
        this.telephoneNumber = telephoneNumber;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getImitsName() {
        return imitsName;
    }

    public void setImitsName(String imitsName) {
        this.imitsName = imitsName;
    }
}
