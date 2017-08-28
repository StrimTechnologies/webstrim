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
package me.strim.webstrim.service;

import java.util.List;
import javax.persistence.EntityManager;
import javax.ws.rs.InternalServerErrorException;
import me.strim.webstrim.ErrorMessage;

/**
 *
 * @author mihai
 */
public abstract class AbstractFacade<T> {

    private Class<T> entityClass;

    public AbstractFacade(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    protected abstract EntityManager getEntityManager();

    public void create(T entity) {
        ErrorMessage errorMessage = null;
        try {
            getEntityManager().persist(entity);
            getEntityManager().flush();
        } catch (Exception ex) {
            ex.printStackTrace();
            if (ex.getCause() != null) {
                errorMessage = new ErrorMessage(ex.getCause().getMessage(), 500, "Internal Server Error");
            } else {
                errorMessage = new ErrorMessage(ex.getCause().getMessage(), 500, "Internal Server Error");
            }
            throw new InternalServerErrorException(ex);
        }
    }

    public void edit(T entity) {
        ErrorMessage errorMessage = null;
        try {
            getEntityManager().merge(entity);
            getEntityManager().flush();
        } catch (Exception ex) {
            ex.printStackTrace();
            if (ex.getCause() != null) {
                errorMessage = new ErrorMessage(ex.getCause().getMessage(), 500, "Internal Server Error");
            } else {
                errorMessage = new ErrorMessage(ex.getCause().getMessage(), 500, "Internal Server Error");
            }
            throw new InternalServerErrorException(ex);
        }
    }

    public void remove(T entity) {
        ErrorMessage errorMessage = null;
        try {
            getEntityManager().remove(getEntityManager().merge(entity));
            getEntityManager().flush();
        } catch (Exception ex) {
            ex.printStackTrace();
            if (ex.getCause() != null) {
                errorMessage = new ErrorMessage(ex.getCause().getMessage(), 500, "Internal Server Error");
            } else {
                errorMessage = new ErrorMessage(ex.getCause().getMessage(), 500, "Internal Server Error");
            }
            throw new InternalServerErrorException(ex);
        }
    }

    public T find(Object id) {
        return getEntityManager().find(entityClass, id);
    }

    public List<T> findAll() {
        javax.persistence.criteria.CriteriaQuery cq = getEntityManager().getCriteriaBuilder().createQuery();
        cq.select(cq.from(entityClass));
        return getEntityManager().createQuery(cq).getResultList();
    }

    public List<T> findRange(int[] range) {
        javax.persistence.criteria.CriteriaQuery cq = getEntityManager().getCriteriaBuilder().createQuery();
        cq.select(cq.from(entityClass));
        javax.persistence.Query q = getEntityManager().createQuery(cq);
        q.setMaxResults(range[1] - range[0] + 1);
        q.setFirstResult(range[0]);
        return q.getResultList();
    }

    public int count() {
        javax.persistence.criteria.CriteriaQuery cq = getEntityManager().getCriteriaBuilder().createQuery();
        javax.persistence.criteria.Root<T> rt = cq.from(entityClass);
        cq.select(getEntityManager().getCriteriaBuilder().count(rt));
        javax.persistence.Query q = getEntityManager().createQuery(cq);
        return ((Long) q.getSingleResult()).intValue();
    }

}
