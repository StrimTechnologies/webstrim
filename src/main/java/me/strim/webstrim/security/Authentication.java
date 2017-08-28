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
package me.strim.webstrim.security;

import java.io.IOException;
import java.util.List;
import java.util.StringTokenizer;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import me.strim.webstrim.Users;
import me.strim.webstrim.service.AbstractFacade;
import org.glassfish.jersey.internal.util.Base64;

/**
 *
 * @author mihai
 */
@javax.ejb.Stateless
@Provider
public class Authentication extends AbstractFacade<Users> implements ContainerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String AUTHORIZATION_HEADER_PREFIX = "Basic ";
    private static final String SECURED_URL_PREFIX = "secured";

    @PersistenceContext(unitName = "me.strim_webstrim_war_0.0.1PU")
    private EntityManager em;

    public Authentication() {
        super(Users.class);
    }

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        if (requestContext.getUriInfo().getPath().contains(SECURED_URL_PREFIX)) {
            List<String> authHeader = requestContext.getHeaders().get(AUTHORIZATION_HEADER);
            if (authHeader != null && authHeader.size() > 0) {
                String authToken = authHeader.get(0);
                authToken = authToken.replaceFirst(AUTHORIZATION_HEADER_PREFIX, "");
                String decodeString = Base64.decodeAsString(authToken);
                StringTokenizer tokenizer = new StringTokenizer(decodeString, ":");
                String username = tokenizer.nextToken();
                String password = tokenizer.nextToken();

                Users user = null;
                try {
                user =(Users) em.createNamedQuery("Users.findByUsername").setParameter("username", username).getSingleResult();
                } catch (NoResultException ex){
                    ex.printStackTrace();
                }

                if (user !=null && user.getPasswd().equals(password)) {
                    return;
                }
            }
            
            Response unauthorizedStatus = Response
                    .status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid Username or Password")
                    .build();
            //requestContext.abortWith(unauthorizedStatus);
            
            throw new NotAuthorizedException(unauthorizedStatus);
        }
    }

}
