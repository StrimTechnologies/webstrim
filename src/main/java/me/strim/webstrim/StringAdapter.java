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

import javax.xml.bind.annotation.adapters.XmlAdapter;

/**
 *
 * @author mciocan
 */
public class StringAdapter extends XmlAdapter<String, String> {

    @Override
    public String marshal(String string) throws Exception {
        return null;
    }

    @Override
    public String unmarshal(String string) throws Exception {
        return string;
    }

}