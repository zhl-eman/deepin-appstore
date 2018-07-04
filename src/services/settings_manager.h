/*
 * Copyright (C) 2017 ~ 2018 Deepin Technology Co., Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef DEEPIN_APPSTORE_SERVICES_SETTINGS_MANAGER_H
#define DEEPIN_APPSTORE_SERVICES_SETTINGS_MANAGER_H

#include <QString>

namespace dstore {

bool IsSignInSupported();

QString GetMetadataServer();

QString GetOperationServer();

enum OperationServerRegion {
  RegionChina = 0,
  RegionInternational = 1,
};

/**
 * Set operation server address.
 * @param region
 */
void SetRegion(OperationServerRegion region);

OperationServerRegion GetRegion();

QString GetSessionSettingsFile();

}  // namespace dstore

#endif  // DEEPIN_APPSTORE_SERVICES_SETTINGS_MANAGER_H