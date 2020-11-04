import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AgFrameworkComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-cell-renderer',
  templateUrl: './cell-renderer.component.html',
  styleUrls: ['./cell-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellRendererComponent implements AgFrameworkComponent<ICellRendererParams> {
  public params!: ICellRendererParams;

  agInit(params: ICellRendererParams) {
    this.params = params;
  }
}
