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

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import me.strim.webstrim.ErrorMessage;

/**
 *
 * @author mciocan
 */
public class GenericExceptionMapper implements ExceptionMapper<Throwable> {

    @Override
    public Response toResponse(Throwable ex) {
        ex.printStackTrace();
        ErrorMessage errorMessage =null;
        if (ex.getCause() != null) {
            errorMessage = new ErrorMessage(ex.getCause().getMessage(), 1, "Unexpected error has occurred. A team of poorly trained specialized monkeys are one it");
        } else {
            errorMessage = new ErrorMessage(ex.getMessage(), 1, "Unexpected error has occurred. A team of poorly trained specialized monkeys are one it");
        }
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(errorMessage)
                .build();
    }

}
