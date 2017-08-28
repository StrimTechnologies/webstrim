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
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

/**
 *
 * @author mihai
 */
@Entity
@Table(name = "users")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Users.findAll", query = "SELECT u FROM Users u")
    , @NamedQuery(name = "Users.findByUserId", query = "SELECT u FROM Users u WHERE u.userId = :userId")
    , @NamedQuery(name = "Users.findByUsername", query = "SELECT u FROM Users u WHERE u.username = :username")
    , @NamedQuery(name = "Users.findByPasswd", query = "SELECT u FROM Users u WHERE u.passwd = :passwd")
    , @NamedQuery(name = "Users.findByWalletAddress", query = "SELECT u FROM Users u WHERE u.walletAddress = :walletAddress")
    , @NamedQuery(name = "Users.findByLastLogin", query = "SELECT u FROM Users u WHERE u.lastLogin = :lastLogin")
    , @NamedQuery(name = "Users.findByFailedLogin", query = "SELECT u FROM Users u WHERE u.failedLogin = :failedLogin")
    , @NamedQuery(name = "Users.findByDateCreated", query = "SELECT u FROM Users u WHERE u.dateCreated = :dateCreated")
    , @NamedQuery(name = "Users.findByDateUpdated", query = "SELECT u FROM Users u WHERE u.dateUpdated = :dateUpdated")
    , @NamedQuery(name = "Users.findByUserRating", query = "SELECT u FROM Users u WHERE u.userRating = :userRating")
    , @NamedQuery(name = "Users.findByTimezone", query = "SELECT u FROM Users u WHERE u.timezone = :timezone")})
public class Users implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "user_id")
    private Integer userId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 200)
    @Column(name = "username")
    private String username;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 64)
    @Column(name = "passwd")
    @XmlJavaTypeAdapter(StringAdapter.class)
    private String passwd;
    @Size(max = 50)
    @Column(name = "wallet_address")
    private String walletAddress;
    @Column(name = "last_login")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastLogin;
    @Column(name = "failed_login")
    private Integer failedLogin;
    @Column(name = "date_created", insertable=false, updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated;
    @Column(name = "date_updated", insertable=false, updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateUpdated;
    @Column(name = "user_rating")
    private Integer userRating;
    @Size(max = 60)
    @Column(name = "timezone")
    private String timezone;
    @Lob
    @Size(max = 65535)
    @Column(name = "banlist")
    private String banlist;
    @OneToMany(mappedBy = "userId")
    private Collection<Devices> devicesCollection;
    @OneToMany(mappedBy = "demanderId")
    private Collection<UserRequests> userRequestsCollection;
    @OneToMany(mappedBy = "supplierId")
    private Collection<UserRequests> userRequestsCollection1;

    public Users() {
    }

    public Users(Integer userId) {
        this.userId = userId;
    }

    public Users(Integer userId, String username, String passwd) {
        this.userId = userId;
        this.username = username;
        this.passwd = passwd;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Integer getFailedLogin() {
        return failedLogin;
    }

    public void setFailedLogin(Integer failedLogin) {
        this.failedLogin = failedLogin;
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

    public Integer getUserRating() {
        return userRating;
    }

    public void setUserRating(Integer userRating) {
        this.userRating = userRating;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getBanlist() {
        return banlist;
    }

    public void setBanlist(String banlist) {
        this.banlist = banlist;
    }

    @XmlTransient
    public Collection<Devices> getDevicesCollection() {
        return devicesCollection;
    }

    public void setDevicesCollection(Collection<Devices> devicesCollection) {
        this.devicesCollection = devicesCollection;
    }

    @XmlTransient
    public Collection<UserRequests> getUserRequestsCollection() {
        return userRequestsCollection;
    }

    public void setUserRequestsCollection(Collection<UserRequests> userRequestsCollection) {
        this.userRequestsCollection = userRequestsCollection;
    }

    @XmlTransient
    public Collection<UserRequests> getUserRequestsCollection1() {
        return userRequestsCollection1;
    }

    public void setUserRequestsCollection1(Collection<UserRequests> userRequestsCollection1) {
        this.userRequestsCollection1 = userRequestsCollection1;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (userId != null ? userId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Users)) {
            return false;
        }
        Users other = (Users) object;
        if ((this.userId == null && other.userId != null) || (this.userId != null && !this.userId.equals(other.userId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "me.strim.webstrim.Users[ userId=" + userId + " ]";
    }

}
