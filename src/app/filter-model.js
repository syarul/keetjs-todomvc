import { CreateModel } from 'keet'

class FilterModel extends CreateModel {
  switch (hash, obj) {
    this.list = this.list.map(filter =>
      filter.hash === hash ? ({ ...filter, ...obj }) : ({ ...filter, selected: false })
    )
  }
}

export default FilterModel
