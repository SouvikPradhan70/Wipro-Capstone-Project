import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { PropertyFull } from '../../models/property.models';
import { PropertyService } from '../../core/services/property.service';
import { ReservationService } from '../../core/services/reservation.service';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../core/services/message.service';
import { Message } from '../../models/message.models';


@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.scss']
})
export class PropertyDetail implements OnInit {
  id!: number;
  data?: PropertyFull;

  checkIn = '';
  checkOut = '';
  guests = 1;
  msg = '';
  newMessage = '';
  messageStatus = '';


  //Store messages (replies) for this renter
  replies: Message[] = [];


  constructor(
    private route: ActivatedRoute,
    private api: PropertyService,
    private reservations: ReservationService,
    public auth: AuthService,
    private messages: MessageService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getById(this.id).subscribe(p => (this.data = p));

    this.loadMessages(); 
  }
  loadMessages() {
    this.messages.getByProperty(this.id).subscribe(msgs => {
      const userId = this.auth.userId; // current renter
      // show only messages where renter is sender or receiver
      this.replies = msgs.filter(m => 
        m.senderId.toString() === userId || m.receiverId.toString() === userId || m.senderId !== userId
      );
    });
  }



  book() {
    if (!this.checkIn || !this.checkOut) {
      this.msg = 'Please select check-in and check-out dates';
      return;
    }
    this.reservations
      .create({
        propertyId: this.id,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        guests: this.guests
      })
      .subscribe({
        next: (res: any) =>
          (this.msg = `Reservation ${res.status}. Total price: ₹ ${res.totalPrice}`),
        error: (err: any) => (this.msg = err?.error ?? 'Booking failed')
      });
  }


  sendMessage() {
    if (!this.newMessage.trim() || !this.data) {
      this.messageStatus = 'Message cannot be empty';
      return;
    }

    const payload = {
      propertyId: this.data.id,
      receiverId: this.data.ownerId,
      content: this.newMessage
    };

    this.messages.send(payload).subscribe({
      next: res => {
        this.messageStatus = 'Message sent!';
        this.newMessage = '';
        this.loadMessages(); ///refresh message after sending 
      },
      error: err => {
        this.messageStatus = err?.error ?? 'Failed to send message';
      }
    });
  }
}
