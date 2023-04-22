// lwc component js file
import { LightningElement, api, wire } from 'lwc';
import { getOpenOpportunities } from '@salesforce/apex/OpportunityController.getOpenOpportunities';

export default class OpenOpportunities extends LightningElement {
    @api columns = [
        { label: 'Opportunity Name', fieldName: 'name' },
        { label: 'Opportunity Owner', fieldName: 'ownerName' },
        { label: 'Stage', fieldName: 'stageName' },
        { label: 'Amount', fieldName: 'amount' },
        { label: 'Closing Date', fieldName: 'closeDate' }
    ];

    @wire(getOpenOpportunities)
    opportunities;

    handleSearch(event) {
        const searchKey = event.target.value;
        this.opportunities = this.opportunities.filter(opportunity => opportunity.name.includes(searchKey));
    }

    handleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        const cloneData = [...this.opportunities];
        cloneData.sort((a, b) => {
            let value1 = a[fieldName];
            let value2 = b[fieldName];

            if (value1 === null || value1 === undefined) {
                value1 = '';
            }
            if (value2 === null || value2 === undefined) {
                value2 = '';
            }

            if (sortDirection === 'asc') {
                return value1 > value2 ? 1 : -1;
            } else if (sortDirection === 'desc') {
                return value1 < value2 ? 1 : -1;
            }
            return 0;
        });
        this.opportunities = cloneData;
    }

    handlePageChange(event) {
        const pageNumber = event.detail.pageNumber;
        const pageSize = event.detail.pageSize;
        const startIndex = pageSize * pageNumber;
        const endIndex = startIndex + pageSize;
        this.opportunities = this.opportunities.slice(startIndex, endIndex);
    }
}