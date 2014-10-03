# swig-react-tags
Swig extensions to write react components using swig tags

## Usage
### Basic example
#### React component swig file
```html
{# ButtonIcon.html #}

{% react render %}
var icon = 'icon' + this.props.icon;
return (
    <button className={icon}>{this.props.children}</button>
);
{% endreact %}
```
#### Template swig file
```html
{# index.html #}
<!DOCTYPE html>
{% reactuse "./ButtonIcon.html" as Icon %}

{% react render %}
<Icon icon="download">Download Node.JS</Icon>
{% endreact %}
```

#### Output
```html
<!DOCTYPE html>

<button class="icon-download" data-reactid="...">Download Node.JS</button>
<script>
var _Icon = React.creatClass({
    render: function() {
        var icon = 'icon' + this.props.icon;
        return (
            <button className={icon}>{this.props.children}</button>
        );
    }
})
</script>
```


## License
Copyright (C) 2014  Jesse Smick

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.