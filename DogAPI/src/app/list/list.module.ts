import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    ShareButtonsModule
  ],
  declarations: [ListPage]
})
export class ListPageModule {}
