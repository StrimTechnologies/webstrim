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
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import me.strim.webstrim.Devices;
import me.strim.webstrim.Senzors;

/**
 *
 * @author mihai
 */
@javax.ejb.Stateless
@Path("senzors")
@Produces(MediaType.APPLICATION_JSON)
public class SenzorsFacadeREST extends AbstractFacade<Senzors> {

    @PersistenceContext(unitName = "me.strim_webstrim_war_0.0.1PU")
    private EntityManager em;

    public SenzorsFacadeREST() {
        super(Senzors.class);
    }

    @POST
    @Override
    @Path("/secured/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public void create(Senzors entity) {
        super.create(entity);
    }

    @PUT
    @Path("/secured/update")
    @Consumes(MediaType.APPLICATION_JSON)
    public void edit(Senzors entity) {
        super.edit(entity);
    }

    @DELETE
    @Path("/secured/delete/{id}")
    public void remove(@PathParam("id") Integer id) {
        super.remove(super.find(id));
    }

    @GET
    @Path("/secured/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Senzors find(@PathParam("id") Integer id) {
        return super.find(id);
    }
    
    @GET
    @Path("/secured/bydevice/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Senzors> findByDeviceId(@PathParam("id") Integer id) {        
        return (List<Senzors>) em.createNamedQuery("Senzors.findByDeviceId").setParameter("devId", id).getResultList();
    }

    @GET
    @Override
    @Path("/secured/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Senzors> findAll() {
        return super.findAll();
    }

    @GET
    @Path("/secured/{from}/{to}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Senzors> findRange(@PathParam("from") Integer from, @PathParam("to") Integer to) {
        return super.findRange(new int[]{from, to});
    }

    @GET
    @Path("/secured/count")
    @Produces(MediaType.TEXT_PLAIN)
    public String countREST() {
        return String.valueOf(super.count());
    }

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

}
