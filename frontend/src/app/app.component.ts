import {Component, OnInit} from '@angular/core';
import {ApiService} from "./service/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  posts: any = [];
  postsForm: FormGroup;
  isAtTheEnd = false
  isScrollable = true
  file: any

  constructor(private apiService: ApiService,
              public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.postsForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      captionText: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
    })
    this.retrieveInitPosts();
  }

  retrieveInitPosts() {
    this.apiService.getInitPosts().subscribe((data) => {
      console.log(data)
      this.posts = data;
    })
  }

  onScroll() {
    if (this.isScrollable && !this.isAtTheEnd) {
      this.isScrollable = false
      this.loadNextPosts()
    }
  }

  loadNextPosts() {
    console.log('load more...');
    this.apiService.getNextPosts(this.posts[this.posts.length - 1].postId).subscribe((data) => {
      if (data.length === 0) {
        this.isAtTheEnd = true
      }
      this.posts = this.posts.concat(data)
      this.isScrollable = true
    })
  }

  // retrievePosts() {
  //   this.apiService.getPosts().subscribe((data) => {
  //     console.log(data)
  //     this.posts = data;
  //   })
  // }

  chooseFile(event) {
    this.file = event.target.files[0];
  }

  getImage(fileName) {
    return `${this.apiService.baseUri}/${fileName}`;
  }

  onSubmit() {
    if (!this.postsForm.valid) {
      console.log('invalid')
      return false;
    }
    let formData: FormData = new FormData();
    if (this.file && this.file.name)
      formData.append('imageUrl', this.file, this.file.name);
    formData.append('fullName', this.postsForm.value.fullName);
    formData.append('captionText', this.postsForm.value.captionText);
    this.apiService.createPost(formData).subscribe(
      (res) => {
        console.log('res', formData)
        if (res.success) {
          setTimeout(() => {
            this.retrieveInitPosts()
          }, 500)
          console.log('Post successfully created!')
        }
      }, (error) => {
        console.log(error);
      });
  }
}
