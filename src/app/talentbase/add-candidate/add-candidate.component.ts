import { Component, OnInit } from '@angular/core';
import { RootVCRService } from '../../root_vcr.service';
import {
	Ng4FilesService,
	Ng4FilesConfig,
	Ng4FilesSelected,
	Ng4FilesStatus
} from 'angular4-files-upload';
import { ViewContainerData } from '@angular/core/src/view';
@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})
export class AddCandidateComponent implements OnInit {

  public files: Array<Blob> = [];

  constructor(
    private _root_vcr: RootVCRService
  ) { }

  ngOnInit() {
    console.log(this.files);
  }

  closeModal(): void {
    this._root_vcr.clear();
  }

  filesSelect(event: Ng4FilesSelected): void {
    this.files = event.files;
  }

  deleteCV(index, array): void {
    array.splice(index, 1);
  }

}
