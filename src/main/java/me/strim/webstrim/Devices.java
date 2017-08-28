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
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author mihai
 */
@Entity
@Table(name = "devices")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Devices.findAll", query = "SELECT d FROM Devices d")
    , @NamedQuery(name = "Devices.findByDeviceId", query = "SELECT d FROM Devices d WHERE d.deviceId = :deviceId")
    , @NamedQuery(name = "Devices.findByDeviceName", query = "SELECT d FROM Devices d WHERE d.deviceName = :deviceName")
    , @NamedQuery(name = "Devices.findByModelId", query = "SELECT d FROM Devices d WHERE d.modelId = :modelId")
    , @NamedQuery(name = "Devices.findByDeviceRating", query = "SELECT d FROM Devices d WHERE d.deviceRating = :deviceRating")
    , @NamedQuery(name = "Devices.findByStatus", query = "SELECT d FROM Devices d WHERE d.status = :status")
    , @NamedQuery(name = "Devices.findByBandwidth", query = "SELECT d FROM Devices d WHERE d.bandwidth = :bandwidth")
    , @NamedQuery(name = "Devices.findByPrice", query = "SELECT d FROM Devices d WHERE d.price = :price")
    , @NamedQuery(name = "Devices.findByDescription", query = "SELECT d FROM Devices d WHERE d.description = :description")
    , @NamedQuery(name = "Devices.findByRoomInfo", query = "SELECT d FROM Devices d WHERE d.roomInfo = :roomInfo")
    , @NamedQuery(name = "Devices.findByDateCreated", query = "SELECT d FROM Devices d WHERE d.dateCreated = :dateCreated")
    , @NamedQuery(name = "Devices.findByDateUpdated", query = "SELECT d FROM Devices d WHERE d.dateUpdated = :dateUpdated")
    , @NamedQuery(name = "Devices.findByUsername", query = "SELECT d FROM Devices d WHERE d.userId = (SELECT 'user_id' FROM Users u WHERE u.username= :username)")})
public class Devices implements Serializable {

    @Column(name = "strim_status")
    private Boolean strimStatus;

    @Size(max = 2000)
    @Column(name = "strim_metadata")
    private String strimMetadata;

    @Size(max = 200)
    @Column(name = "strim_name")
    private String strimName;
    @Column(name = "strim_type")
    private Integer strimType;
    @Size(max = 200)
    @Column(name = "strim_info")
    private String strimInfo;
    @Size(max = 200)
    @Column(name = "strim_location")
    private String strimLocation;

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "device_id")
    private Integer deviceId;
    @Size(max = 200)
    @Column(name = "device_name")
    private String deviceName;
    @Size(max = 200)
    @Column(name = "model_id")
    private String modelId;
    @Column(name = "device_rating")
    private Integer deviceRating;
    @Column(name = "status")
    private Integer status;
    @Column(name = "bandwidth")
    private Integer bandwidth;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "price")
    private Float price;
    @Size(max = 2000)
    @Column(name = "description")
    private String description;
    @Size(max = 200)
    @Column(name = "room_info")
    private String roomInfo;
    @Column(name = "date_created", insertable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated;
    @Column(name = "date_updated", insertable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateUpdated;
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    @ManyToOne
    private Users userId;
    @OneToMany(mappedBy = "deviceId")
    private Collection<Senzors> senzorsCollection;

    public Devices() {
    }

    public Devices(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public Integer getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getModelId() {
        return modelId;
    }

    public void setModelId(String modelId) {
        this.modelId = modelId;
    }

    public Integer getDeviceRating() {
        return deviceRating;
    }

    public void setDeviceRating(Integer deviceRating) {
        this.deviceRating = deviceRating;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getBandwidth() {
        return bandwidth;
    }

    public void setBandwidth(Integer bandwidth) {
        this.bandwidth = bandwidth;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRoomInfo() {
        return roomInfo;
    }

    public void setRoomInfo(String roomInfo) {
        this.roomInfo = roomInfo;
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

    public Users getUserId() {
        return userId;
    }

    public void setUserId(Users userId) {
        this.userId = userId;
    }

    @XmlTransient
    public Collection<Senzors> getSenzorsCollection() {
        return senzorsCollection;
    }

    public void setSenzorsCollection(Collection<Senzors> senzorsCollection) {
        this.senzorsCollection = senzorsCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (deviceId != null ? deviceId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Devices)) {
            return false;
        }
        Devices other = (Devices) object;
        if ((this.deviceId == null && other.deviceId != null) || (this.deviceId != null && !this.deviceId.equals(other.deviceId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "me.strim.webstrim.Devices[ deviceId=" + deviceId + " ]";
    }

    public String getStrimName() {
        return strimName;
    }

    public void setStrimName(String strimName) {
        this.strimName = strimName;
    }

    public Integer getStrimType() {
        return strimType;
    }

    public void setStrimType(Integer strimType) {
        this.strimType = strimType;
    }

    public String getStrimInfo() {
        return strimInfo;
    }

    public void setStrimInfo(String strimInfo) {
        this.strimInfo = strimInfo;
    }

    public String getStrimLocation() {
        return strimLocation;
    }

    public void setStrimLocation(String strimLocation) {
        this.strimLocation = strimLocation;
    }

    public String getStrimMetadata() {
        return strimMetadata;
    }

    public void setStrimMetadata(String strimMetadata) {
        this.strimMetadata = strimMetadata;
    }

    public Boolean getStrimStatus() {
        return strimStatus;
    }

    public void setStrimStatus(Boolean strimStatus) {
        this.strimStatus = strimStatus;
    }
}
