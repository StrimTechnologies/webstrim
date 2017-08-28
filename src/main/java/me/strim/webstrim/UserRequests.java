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
@Table(name = "user_requests")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "UserRequests.findAll", query = "SELECT u FROM UserRequests u")
    , @NamedQuery(name = "UserRequests.findByRequestsId", query = "SELECT u FROM UserRequests u WHERE u.requestsId = :requestsId")
    , @NamedQuery(name = "UserRequests.findByScheduledDate", query = "SELECT u FROM UserRequests u WHERE u.scheduledDate = :scheduledDate")
    , @NamedQuery(name = "UserRequests.findByDateCreated", query = "SELECT u FROM UserRequests u WHERE u.dateCreated = :dateCreated")
    , @NamedQuery(name = "UserRequests.findByUserRequests", query = "SELECT u FROM UserRequests u WHERE u.userRequests = :userRequests")
    , @NamedQuery(name = "UserRequests.findByDemanderName", query = "SELECT ur FROM UserRequests ur WHERE ur.demanderId = (select 'user_id' from Users u where u.username= :username)")
    , @NamedQuery(name = "UserRequests.findBySupplierName", query = "SELECT ur FROM UserRequests ur WHERE ur.supplierId = (select 'user_id' from Users u where u.username= :username)")})
public class UserRequests implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "requests_id")
    private Integer requestsId;
    @Column(name = "scheduled_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date scheduledDate;
    @Column(name = "date_created", insertable=false, updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated;
    @Column(name = "user_requests")
    @Temporal(TemporalType.TIMESTAMP)
    private Date userRequests;
    @JoinColumn(name = "demander_id", referencedColumnName = "user_id")
    @ManyToOne
    private Users demanderId;
    @JoinColumn(name = "supplier_id", referencedColumnName = "user_id")
    @ManyToOne
    private Users supplierId;

    public UserRequests() {
    }

    public UserRequests(Integer requestsId) {
        this.requestsId = requestsId;
    }

    public Integer getRequestsId() {
        return requestsId;
    }

    public void setRequestsId(Integer requestsId) {
        this.requestsId = requestsId;
    }

    public Date getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(Date scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Date getUserRequests() {
        return userRequests;
    }

    public void setUserRequests(Date userRequests) {
        this.userRequests = userRequests;
    }

    public Users getDemanderId() {
        return demanderId;
    }

    public void setDemanderId(Users demanderId) {
        this.demanderId = demanderId;
    }

    public Users getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Users supplierId) {
        this.supplierId = supplierId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (requestsId != null ? requestsId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof UserRequests)) {
            return false;
        }
        UserRequests other = (UserRequests) object;
        if ((this.requestsId == null && other.requestsId != null) || (this.requestsId != null && !this.requestsId.equals(other.requestsId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "me.strim.webstrim.UserRequests[ requestsId=" + requestsId + " ]";
    }

}
