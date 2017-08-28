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
package me.strim.webstrim.exceptions;

import javax.ws.rs.ForbiddenException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import me.strim.webstrim.ErrorMessage;

/**
 *
 * @author mihai
 */
@Provider
public class ForbiddenExceptionMapper implements ExceptionMapper<ForbiddenException> {

    @Override
    public Response toResponse(ForbiddenException ex) {
        ex.printStackTrace();
        ErrorMessage errorMessage = null;
        if (ex.getCause() != null) {
            errorMessage = new ErrorMessage(ex.getCause().getMessage(), 403, "Not permitted to access");
        } else {
            errorMessage = new ErrorMessage(ex.getMessage(), 403, "Not permitted to access");
        }
        return Response.status(Response.Status.FORBIDDEN)
                .entity(errorMessage)
                .build();
    }

}
