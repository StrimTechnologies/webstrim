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
import java.util.Collection;
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
import javax.persistence.OneToMany;
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
@Table(name = "senzors")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Senzors.findAll", query = "SELECT s FROM Senzors s")
    , @NamedQuery(name = "Senzors.findBySenzorId", query = "SELECT s FROM Senzors s WHERE s.senzorId = :senzorId")
    , @NamedQuery(name = "Senzors.findByIsMinable", query = "SELECT s FROM Senzors s WHERE s.isMinable = :isMinable")
    , @NamedQuery(name = "Senzors.findByStatus", query = "SELECT s FROM Senzors s WHERE s.status = :status")
    , @NamedQuery(name = "Senzors.findByDateCreated", query = "SELECT s FROM Senzors s WHERE s.dateCreated = :dateCreated")
    , @NamedQuery(name = "Senzors.findByDateUpdated", query = "SELECT s FROM Senzors s WHERE s.dateUpdated = :dateUpdated")
    , @NamedQuery(name = "Senzors.findByDeviceId", query = "SELECT s FROM Senzors s WHERE s.deviceId.deviceId = :devId")})
public class Senzors implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "senzor_id")
    private Integer senzorId;
    @Column(name = "is_minable")
    private Boolean isMinable;
    @Column(name = "status")
    private Integer status;
    @Column(name = "date_created", insertable=false, updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated;
    @Column(name = "date_updated", insertable=false, updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateUpdated;
    @OneToMany(mappedBy = "senzorId")
    private Collection<SenzorValues> senzorValuesCollection;
    @JoinColumn(name = "device_id", referencedColumnName = "device_id")
    @ManyToOne    
    private Devices deviceId;

    public Senzors() {
    }

    public Senzors(Integer senzorId) {
        this.senzorId = senzorId;
    }

    public Integer getSenzorId() {
        return senzorId;
    }

    public void setSenzorId(Integer senzorId) {
        this.senzorId = senzorId;
    }

    public Boolean getIsMinable() {
        return isMinable;
    }

    public void setIsMinable(Boolean isMinable) {
        this.isMinable = isMinable;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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

    @XmlTransient
    public Collection<SenzorValues> getSenzorValuesCollection() {
        return senzorValuesCollection;
    }

    public void setSenzorValuesCollection(Collection<SenzorValues> senzorValuesCollection) {
        this.senzorValuesCollection = senzorValuesCollection;
    }

    public Devices getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Devices deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (senzorId != null ? senzorId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Senzors)) {
            return false;
        }
        Senzors other = (Senzors) object;
        if ((this.senzorId == null && other.senzorId != null) || (this.senzorId != null && !this.senzorId.equals(other.senzorId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "me.strim.webstrim.Senzors[ senzorId=" + senzorId + " ]";
    }

}
