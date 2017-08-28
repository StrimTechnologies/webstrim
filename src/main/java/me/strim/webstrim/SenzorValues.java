/* 
 * Copyright (C) 2017 strim.me
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package me.strim.webstrim;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author mihai
 */
@Entity
@Table(name = "senzor_values")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "SenzorValues.findAll", query = "SELECT s FROM SenzorValues s WHERE s.senzorId.deviceId IN (SELECT d FROM Devices d WHERE d.strimStatus='true')")
    , @NamedQuery(name = "SenzorValues.findByValueId", query = "SELECT s FROM SenzorValues s WHERE s.valueId = :valueId")
    , @NamedQuery(name = "SenzorValues.findByLatitude", query = "SELECT s FROM SenzorValues s WHERE s.latitude = :latitude")
    , @NamedQuery(name = "SenzorValues.findByLongitude", query = "SELECT s FROM SenzorValues s WHERE s.longitude = :longitude")
    , @NamedQuery(name = "SenzorValues.findByDateCreated", query = "SELECT s FROM SenzorValues s WHERE s.dateCreated = :dateCreated")
    , @NamedQuery(name = "SenzorValues.findByDateUpdated", query = "SELECT s FROM SenzorValues s WHERE s.dateUpdated = :dateUpdated")
    , @NamedQuery(name = "SenzorValues.findBySenzorId", query = "SELECT s FROM SenzorValues s WHERE s.senzorId.senzorId = :senId")
    , @NamedQuery(name = "SenzorValues.findAllStreaming", query = "SELECT s FROM SenzorValues s WHERE s.senzorId.deviceId IN (SELECT d FROM Devices d WHERE d.strimStatus='true')")
    , @NamedQuery(name = "SenzorValues.findAllInRange", query = "SELECT s FROM SenzorValues s WHERE s.senzorId.deviceId IN (SELECT d FROM Devices d WHERE d.strimStatus='true') "
                         + "AND s.longitude > :min_longitude AND s.longitude <= :max_longitude "
                         + "AND s.latitude > :min_latitude AND s.latitude <= :max_latitude")})
public class SenzorValues implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "value_id")
    private Integer valueId;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "latitude")
    private Float latitude;
    @Column(name = "longitude")
    private Float longitude;
    @Column(name = "date_created", insertable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated;
    @Column(name = "date_updated", insertable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateUpdated;
    @JoinColumn(name = "senzor_id", referencedColumnName = "senzor_id")
    @ManyToOne
    private Senzors senzorId;

    public SenzorValues() {
    }

    public SenzorValues(Integer valueId) {
        this.valueId = valueId;
    }

    public Integer getValueId() {
        return valueId;
    }

    public void setValueId(Integer valueId) {
        this.valueId = valueId;
    }

    public Float getLatitude() {
        return latitude;
    }

    public void setLatitude(Float latitude) {
        this.latitude = latitude;
    }

    public Float getLongitude() {
        return longitude;
    }

    public void setLongitude(Float longitude) {
        this.longitude = longitude;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Date getDateUpdated() {
        return dateUpdated;
    }

    public void setDateUpdated(Date dateUpdated) {
        this.dateUpdated = dateUpdated;
    }

    public Senzors getSenzorId() {
        return senzorId;
    }

    public void setSenzorId(Senzors senzorId) {
        this.senzorId = senzorId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (valueId != null ? valueId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof SenzorValues)) {
            return false;
        }
        SenzorValues other = (SenzorValues) object;
        if ((this.valueId == null && other.valueId != null) || (this.valueId != null && !this.valueId.equals(other.valueId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "me.strim.webstrim.SenzorValues[ valueId=" + valueId + " ]";
    }

}
