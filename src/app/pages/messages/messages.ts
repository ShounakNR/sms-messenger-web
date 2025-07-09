// messages.page.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Message {
  id: string;
  phone_number: string;
  content: string;
  created_at: string;
  status: string
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white text-black p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-center w-full">MY SMS MESSENGER</h1>
        <button (click)="logout()" class="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
      </div>

      <!-- Toast Notification -->
      <div *ngIf="toast" class="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
        {{ toast }}
      </div>

      <!-- Modal -->
      <div *ngIf="showModal()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">New Message</h2>
          <form (ngSubmit)="submitMessage()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Phone Number</label>
              <input type="text" [(ngModel)]="phone" name="phone" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
              <div *ngIf="formErrors.phone" class="text-red-600 text-sm">{{ formErrors.phone }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Message</label>
              <textarea [(ngModel)]="content" name="content" required maxlength="250"
                        rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"></textarea>
              <div class="text-right text-sm text-gray-500">{{ content.length }}/250</div>
            </div>

            <div class="flex justify-between items-center">
              <button type="button" (click)="toggleModal()" class="text-black underline">Clear</button>
              <button type="submit" class="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800">Submit</button>
            </div>
            <div *ngIf="error" class="text-red-600 text-sm">{{ error }}</div>
          </form>
        </div>
      </div>

      <!-- Layout -->
      <div class="grid grid-cols-6">
        <!-- Left Panel -->
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
          <button (click)="toggleModal()"
                  class="bg-black text-white px-4 py-1 rounded hover:bg-gray-800">New Message</button>
          </div>
        </div>

        <!-- Right Panel: Message History -->
        <div class="col-span-5 rounded-xl shadow-lg p-6 max-h-[80vh] overflow-y-auto">
          <h2 class="text-xl font-bold mb-4">Message History ({{ messages().length }})</h2>

          <div *ngFor="let msg of messages()" class="mb-4 p-4 ">

            <div class="flex justify-between text-sm font-semibold mb-1 ">
              <span>{{ msg.phone_number }}</span>
              <span>{{ formatTimestamp(msg.created_at) }}</span>
            </div>
            <div class="border border-gray-300 rounded p-2">
              <p class="text-sm">{{ msg.content }}</p>
            </div>
            <div class="text-xs text-right text-gray-500 flex justify-between">
              <span>Status: {{ msg.status || 'unknown' }}</span>
              <span>{{ msg.content.length }}/250</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Messages {
  private http = inject(HttpClient);
  private router = inject(Router);

  messages = signal<Message[]>([]);
  showModal = signal(false);

  phone = '';
  content = '';
  error = '';
  toast = '';
  formErrors: { phone?: string } = {};

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.http.get<Message[]>(`${environment.apiUrl}/api/messages`, { withCredentials: true })
      .subscribe({
        next: (data) => this.messages.set(data),
        error: () => this.error = 'Failed to load messages'
      });
  }

  toggleModal() {
    this.showModal.update(open => !open);
    this.phone = '';
    this.content = '';
    this.error = '';
    this.formErrors = {};
  }

  submitMessage() {
    this.error = '';
    this.formErrors = {};

    if (!this.phone.trim()) {
      this.formErrors.phone = 'Phone number cannot be blank.';
      return;
    }

    const payload = {
      message: {
        phone_number: this.phone,
        content: this.content
      }
    };

    this.http.post(`${environment.apiUrl}/api/messages`, payload, { withCredentials: true })
      .subscribe({
        next: () => {
          this.toggleModal();
          this.loadMessages();
          this.showToast('Message sent successfully');
        },
        error: () => {
          this.error = 'Failed to send message';
          this.showToast('Failed to send message');
        }
      });
  }

  showToast(message: string) {
    this.toast = message;
    setTimeout(() => this.toast = '', 3000);
  }

  logout() {
    this.http.delete(`${environment.apiUrl}/logout`, { withCredentials: true })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => this.showToast('Logout failed')
      });
  }

  formatTimestamp(dateStr: string): string {
    return formatDate(dateStr, 'EEEE dd-MMMM-yyyy HH:mm:ss UTC', 'en-US', 'UTC');
  }
}
