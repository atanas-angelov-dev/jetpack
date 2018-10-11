/*global jQuery _ wp*/
/** @jsx wp.element.createElement */
/** @format */

/**
 * External dependencies
 */
import {
	PanelBody,
	TextControl,
	TextareaControl,
	CheckboxControl,
	ToggleControl
} from '@wordpress/components';

import {
	registerBlockType,
	createBlock
} from '@wordpress/blocks';

import {
	InnerBlocks,
	InspectorControls
} from '@wordpress/editor';

import {
	Component,
	Fragment
} from '@wordpress/element';

import {
	__
} from '@wordpress/i18n';



/**
 * Components:
 */

class GrunionForm extends Component {
	render() {
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Submission Details', 'jetpack' ) }>
						<TextControl
							label={ __( 'What would you like the subject of the email to be?' ) }
							value={ this.props.subject }
							onChange={ ( x )=>this.props.setAttributes( { subject: x } ) }
						/>
						<TextControl
							label={ __( 'Which email address should we send the submissions to?' ) }
							value={ this.props.to }
							onChange={ ( x )=>this.props.setAttributes( { to: x } ) }
						/>
                        <TextControl
							label={ __( 'What should the label on the form’s submit button say?' ) }
                            value={ this.props.submit ? this.props.submit : __( 'Submit' ) }
                            onChange={ ( x )=>this.props.setAttributes( { submit: x } ) }
                        />
					</PanelBody>
				</InspectorControls>
				<div className="grunion-form">
					{this.props.children}
					<TextControl
						className="button button-primary button-default"
						value={ this.props.submit ? this.props.submit : __( 'Submit' ) }
						onChange={ ( x )=>this.props.setAttributes( { submit: x } ) }
					/>
				</div>
			</Fragment>
		);
	}
}

class GrunionFieldRequiredToggle extends Component {
	render() {
		return (
			<ToggleControl
				label={ __( 'Required' ) }
				checked={ this.props.required }
				onChange={ this.props.onChange }
			/>
		);
	}
}

class GrunionFieldSettings extends Component {
	render() {
		return (
			<InspectorControls>
				<PanelBody title={ __( 'Field Settings', 'jetpack' ) }>
					<GrunionFieldRequiredToggle
						required={this.props.required}
						onChange={ ( x )=>this.props.setAttributes( { required: x } ) }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

class GrunionFieldLabel extends Component {
	render() {
		return (
			<Fragment>
				<input
					type='text'
					value={this.props.label}
					className='grunion-field-label'
					onChange={ ( x )=>this.props.setAttributes( { label: x.target.value } ) }
				/>
				{ this.props.required && <span className="required">{ __( '(required)' ) }</span> }
			</Fragment>
		);
	}
}

class GrunionField extends Component {
	render() {
		return (
			<Fragment>
				<GrunionFieldSettings
					required={ this.props.required }
					setAttributes={ this.props.setAttributes }
				/>
				<div className="grunion-field">
					<TextControl
						type={ this.props.type }
						label={ <GrunionFieldLabel
							required={ this.props.required }
							label={ this.props.label }
                            setAttributes={ this.props.setAttributes }
						/> }
						disabled={ true }
					/>
				</div>
			</Fragment>
		);
	}
}

class GrunionFieldTextarea extends Component {
	render() {
		return (
			<Fragment>
				<GrunionFieldSettings
					required={ this.props.required }
                    setAttributes={ this.props.setAttributes }
				/>
				<div className="grunion-field">
					<TextareaControl
						label={ <GrunionFieldLabel
							required={ this.props.required }
							label={ this.props.label }
                            setAttributes={ this.props.setAttributes }
						/> }
						disabled={ true }
					/>
				</div>
			</Fragment>
		);
	}
}

class GrunionFieldCheckbox extends Component {
	render() {
		return (
			<Fragment>
				<GrunionFieldSettings
					required={ this.props.required }
                    setAttributes={ this.props.setAttributes }
				/>
				<div className="grunion-field">
					<CheckboxControl
						label={ <GrunionFieldLabel
							required={ this.props.required }
							label={ this.props.label }
                            setAttributes={ this.props.setAttributes }
						/> }
						disabled={ true }
					/>
				</div>
			</Fragment>
		);
	}
}

class GrunionFieldMultiple extends Component {
	render() {
		return (
			<Fragment>
				<GrunionFieldSettings
					required={ this.props.required }
                    setAttributes={ this.props.setAttributes }
				/>
				<div className="grunion-field">
					<GrunionFieldLabel
						required={ this.props.required }
						label={ this.props.label }
                        setAttributes={ this.props.setAttributes }
					/>
					<ol>
						{ _.map( this.props.options, ( option, key )=>( <li key={ key }><input
							type='text'
							className='option'
							value={option}
							onChange={ function( x ) {
								const $options = jQuery( x.target ).closest( 'ol' ).find( 'input.option' );
								this.props.setAttributes({
									options : _.pluck( $options.toArray(), 'value' )
								});
							}.bind( this ) }
						/></li>))}
					</ol>
					<button onClick={ ()=>this.props.setAttributes( { options: this.props.options.concat( [ '' ] ) } ) }>{ __( 'Add New' ) }</button>
				</div>
			</Fragment>
		)
	}
}


/**
 * Block Registrations:
 */

registerBlockType( 'grunion/form', {
	title       : __( 'Contact Form', 'jetpack' ),
	icon        : 'feedback',
	category    : 'widgets',
	supports    : {
		html : false
	},

	attributes : {
		subject : {
			type    : 'string',
			default : null
		},
		to : {
			type    : 'string',
			default : null
		},
		submit : {
			type    : 'string',
			default : __( 'Submit' )
		}
	},

	edit: function( props ) {
		return (
			<GrunionForm
				key="grunion/form"
				className={ props.className }
				subject={ props.attributes.subject }
				to={ props.attributes.to }
				submit={ props.attributes.submit }
				setAttributes={ props.setAttributes }
			>
				<InnerBlocks
					allowedBlocks={ [] }
					templateLock={false}
					template={ [
						[ 'grunion/field-name',     { label : __( 'Name' ) } ],
						[ 'grunion/field-email',    { label : __( 'Email' ) } ],
						[ 'grunion/field-text',     { label : __( 'Subject' ) } ],
						[ 'grunion/field-textarea', { label : __( 'Message' ) } ]
					] }
				/>
			</GrunionForm>
		);
	},

	save: function() {
		return (
			<InnerBlocks.Content />
		);
	}
} );

const FieldDefaults = {
	icon        : 'feedback',
	category    : 'common',
	parent      : [ 'grunion/form' ],
	supports    : {
		html : false
	},
	attributes  : {
		label : {
			type : 'string',
			default : __( 'Type here...' )
		},
		required : {
			type : 'boolean',
			default : false
		},
		options : {
			type : 'array',
			default : []
		}
	},
	transforms : {
		to : [
			{
				type      : 'block',
				blocks    : [ 'grunion/field-text' ],
				transform : ( attributes ) => {
					return createBlock( 'grunion/field-text', attributes );
				}
			}
		]
	},
	save : function() {
		return null;
	}
};

registerBlockType( 'grunion/field-text', _.defaults({
	title       : __( 'Text', 'jetpack' ),
	edit: function( props ) {
		return ( <GrunionField
			label={ props.attributes.label }
			required={ props.attributes.required }
            setAttributes={ props.setAttributes }
		/> );
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-name', _.defaults({
	title       : __( 'Name', 'jetpack' ),
	icon        : 'admin-users',
	edit: function( props ) {
		return ( <GrunionField
			type="text"
			label={ props.attributes.label }
			required={ props.attributes.required }
            setAttributes={ props.setAttributes }
		/> );
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-email', _.defaults({
	title       : __( 'Email', 'jetpack' ),
	icon        : 'email',
	edit: function( props ) {
		return ( <GrunionField
			type="email"
			label={ props.attributes.label }
			required={ props.attributes.required }
            setAttributes={ props.setAttributes }
		/> );
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-url', _.defaults({
	title       : __( 'URL', 'jetpack' ),
	icon        : 'share-alt2',
	edit: function( props ) {
		return ( <GrunionField
			type="url"
			label={ props.attributes.label }
			required={ props.attributes.required }
            setAttributes={ props.setAttributes }
		/> );
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-date', _.defaults({
	title       : __( 'Date', 'jetpack' ),
	icon        : 'calendar-alt',
	edit: function( props ) {
		return ( <GrunionField
			type="text"
			label={ props.attributes.label }
			required={ props.attributes.required }
            setAttributes={ props.setAttributes }
		/> );
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-telephone', _.defaults({
	title       : __( 'Telephone', 'jetpack' ),
	icon        : 'phone',
	edit: function( props ) {
		return ( <GrunionField
			type="tel"
			label={ props.attributes.label }
			required={ props.attributes.required }
            setAttributes={ props.setAttributes }
		/> );
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-textarea', _.defaults({
	title       : __( 'Textarea', 'jetpack' ),
	edit: function( props ) {
		return ( <GrunionFieldTextarea
			label={ props.attributes.label }
			required={ props.attributes.required }
            setAttributes={ props.setAttributes }
		/> );
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-checkbox', _.defaults({
	title       : __( 'Checkbox', 'jetpack' ),
	icon        : 'forms',
	edit: function( props ) {
		return ( <GrunionFieldCheckbox
			label={ props.attributes.label }
			required={ props.attributes.required }
            setAttributes={ props.setAttributes }
		/> );
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-checkbox-multiple', _.defaults({
	title       : __( 'Checkbox Multiple', 'jetpack' ),
	icon        : 'forms',
	edit: function( props ) {
		return (<GrunionFieldMultiple
			required={ props.attributes.required }
			label={ props.attributes.label }
			options={ props.attributes.options }
			setAttributes={ props.setAttributes }
		/>);
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-radio', _.defaults({
	title       : __( 'Radio', 'jetpack' ),
	edit: function( props ) {
		return (<GrunionFieldMultiple
			required={ props.attributes.required }
			label={ props.attributes.label }
			options={ props.attributes.options }
			setAttributes={ props.setAttributes }
		/>);
	}
}, FieldDefaults ) );

registerBlockType( 'grunion/field-select', _.defaults({
	title       : __( 'Select', 'jetpack' ),
	edit: function( props ) {
		return (<GrunionFieldMultiple
			required={ props.attributes.required }
			label={ props.attributes.label }
			options={ props.attributes.options }
			setAttributes={ props.setAttributes }
		/>);
	}
}, FieldDefaults ) );

