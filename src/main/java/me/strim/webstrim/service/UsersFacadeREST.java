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
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import me.strim.webstrim.Users;

/**
 * * * @author mihai
 */
@javax.ejb.Stateless
@Path("users")
@Produces(MediaType.APPLICATION_JSON)
public class UsersFacadeREST extends AbstractFacade<Users> {

    @PersistenceContext(unitName = "me.strim_webstrim_war_0.0.1PU")
    private EntityManager em;

    public UsersFacadeREST() {
        super(Users.class);
    }

    @Override
    public void create(Users entity) {
        super.create(entity);
    }

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public String createRest(@HeaderParam("captchaToken") String captchaToken, Users entity) {

        Response response = null;

        try {
            Client client = ClientBuilder.newClient();
            WebTarget webTarget = client.target("https://www.google.com/recaptcha/api/siteverify");
            Builder basicRequest = webTarget.request();

            Form form = new Form();
            form.param("secret", "6LcJYigUAAAAAMUmJllXFdCriOGee7-5bL7psHb2");
            form.param("response", captchaToken);

            response = basicRequest.post(Entity.form(form), Response.class);
            response.bufferEntity();

            if (response != null) {
                String body = response.readEntity(String.class);
                if (body.contains("true")) {
                    create(entity);
                } else {
                    return "The nocaptcha validation has failed";
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new InternalServerErrorException(response);
        }
        return "User created succesfully";
    }

    @PUT
    @Path("/secured/update")
    @Consumes(MediaType.APPLICATION_JSON)
    public void edit(Users entity) {
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
    public Users find(@PathParam("id") Integer id) {
        return super.find(id);
    }

    @GET
    @Path("/secured/username/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Users find(@PathParam("username") String username) {
        return (Users) em.createNamedQuery("Users.findByUsername").setParameter("username", username).getSingleResult();
    }

    @GET
    @Path("/check/username/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public String findUsername(@PathParam("username") String username) {
        Users u = null;
        try {
            u = (Users) em.createNamedQuery("Users.findByUsername").setParameter("username", username).getSingleResult();
        } catch (NoResultException ex) {
            ex.printStackTrace();
        }
        String check = "false";
        if (u != null) {
            check = "true";
        }
        return check;
    }

    @GET
    @Path("/check/wallet/{wallet}")
    @Produces(MediaType.APPLICATION_JSON)
    public String findWallet(@PathParam("wallet") String wallet) {
        Users u = null;
        try {
            u = (Users) em.createNamedQuery("Users.findByWalletAddress").setParameter("walletAddress", wallet).getSingleResult();
        } catch (NoResultException ex) {
            ex.printStackTrace();
        }
        String check = "false";
        if (u != null) {
            check = "true";
        }
        return check;
    }

    @GET
    @Override
    @Path("/secured/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Users> findAll() {
        return super.findAll();
    }

    @GET
    @Path("/secured/{from}/{to}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Users> findRange(@PathParam("from") Integer from, @PathParam("to") Integer to) {
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
