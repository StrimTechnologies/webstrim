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

import com.jcabi.manifests.Manifests;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;


/**
 *
 * @author mihai
 */
@Path("webVersion")
@Produces(MediaType.APPLICATION_JSON)
public class webVersion {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getGitSha1() {
        String gitSha1="";
        try {
         gitSha1= Manifests.read("Strim-Vesion");
        } catch (Exception ex){
            gitSha1 ="Could not Read Strim Web Version";
            ex.printStackTrace();
        }
        return "git-sha-1: ".concat(gitSha1);
    }
    

}
